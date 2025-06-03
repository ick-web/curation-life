import { NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";

interface Performance {
  mt20id: string; // 공연 ID
  prfnm: string; // 공연명
  prfpdfrom: string; // 공연 시작일
  prfpdto: string; // 공연 종료일
  fcltynm: string; // 공연장
  poster: string; // 포스터 이미지 URL
  area: string; // 지역
  genrenm: string; // 장르
  openrun: string; // 오픈런 여부
  prfstate: string; // 공연 상태
}

const KOPIS_API_KEY = process.env.NEXT_PUBLIC_KOPIS_API_KEY;

export async function GET(request: Request) {
  if (!KOPIS_API_KEY) {
    console.error("KOPIS API key is not configured");
    return NextResponse.json(
      { error: "API key is not configured" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  }

  try {
    // URL에서 쿼리 파라미터 추출
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate"); // YYYYMMDD 형식
    const endDate = searchParams.get("endDate"); // YYYYMMDD 형식
    const region = searchParams.get("region"); // 지역명
    const status = searchParams.get("status"); // 공연상태 (공연예정/공연중/공연완료)

    // 날짜 범위 설정 (파라미터가 없으면 기본값 사용)
    let stdate, eddate;
    if (startDate && endDate) {
      stdate = startDate;
      eddate = endDate;
    } else {
      const today = new Date();
      const threeMonthsAgo = new Date();
      const threeMonthsLater = new Date();

      threeMonthsAgo.setMonth(today.getMonth() - 3);
      threeMonthsLater.setMonth(today.getMonth() + 3);

      stdate = formatDateForApi(threeMonthsAgo);
      eddate = formatDateForApi(threeMonthsLater);
    }

    console.log("Date range:", { stdate, eddate });

    // 전시/미술 데이터 가져오기 (B000: 미술, AAAA: 연극, BBBA: 무용, CCCA: 음악, EEEA: 복합)
    const categories = ["B000", "AAAA", "BBBA", "CCCA", "EEEA"];
    let successfulResponse: Performance[] | null = null;

    for (const category of categories) {
      const apiUrl = `http://kopis.or.kr/openApi/restful/pblprfr?service=${KOPIS_API_KEY}&stdate=${stdate}&eddate=${eddate}&rows=100&cpage=1&shcate=${category}`;
      console.log(`Trying KOPIS API with category ${category}:`, apiUrl);

      const response = await fetch(apiUrl, {
        headers: {
          Accept: "application/xml",
          "Content-Type": "application/xml",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`KOPIS API Error for category ${category}:`, errorText);
        continue;
      }

      const xmlText = await response.text();
      console.log(
        `API Response for category ${category} (first 200 chars):`,
        xmlText.substring(0, 200)
      );

      if (!xmlText.includes("<dbs/>")) {
        // XML을 JSON으로 변환
        const parser = new XMLParser({
          ignoreAttributes: true,
          parseTagValue: true,
        });

        try {
          const jsonData = parser.parse(xmlText);

          // dbs.db가 배열인지 확인하고 처리
          if (jsonData.dbs && jsonData.dbs.db) {
            let performances: Performance[] = Array.isArray(jsonData.dbs.db)
              ? jsonData.dbs.db
              : [jsonData.dbs.db];

            // 필터링 적용
            if (region || status) {
              performances = performances.filter((perf: Performance) => {
                const regionMatch = !region || perf.area.includes(region);
                const statusMatch = !status || perf.prfstate === status;
                return regionMatch && statusMatch;
              });
            }

            if (performances.length > 0) {
              successfulResponse = performances;
              console.log(
                `Found ${performances.length} performances for category ${category}`
              );
              break;
            }
          }
        } catch (parseError) {
          console.error(
            `Error parsing XML for category ${category}:`,
            parseError
          );
          continue;
        }
      } else {
        console.log(`No data available for category ${category}`);
      }
    }

    if (!successfulResponse) {
      console.log("No data available from any category");
      return NextResponse.json(
        { error: "No data available from KOPIS API" },
        {
          status: 404,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        }
      );
    }

    // JSON 형식으로 응답 반환
    return NextResponse.json(
      {
        data: successfulResponse,
        filters: {
          dateRange: { start: stdate, end: eddate },
          appliedRegion: region,
          appliedStatus: status,
        },
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (error) {
    console.error("Error in exhibitions API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  }
}

// CORS Preflight 요청 처리
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

// YYYYMMDD 형식의 날짜 변환
function formatDateForApi(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}
