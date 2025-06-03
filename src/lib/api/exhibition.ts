// 한국문화정보원 공연전시 정보 API
const KOPIS_API_KEY = process.env.NEXT_PUBLIC_KOPIS_API_KEY;

export interface Exhibition {
  id: string;
  title: string;
  place: string;
  startDate: string;
  endDate: string;
  thumbnail: string;
  type: "전시" | "팝업";
  description?: string;
  url?: string;
  fee?: string;
  category?: string;
}

interface KopisEvent {
  mt20id: string; // 공연ID
  prfnm: string; // 공연명
  fcltynm: string; // 공연장명
  prfpdfrom: string; // 공연시작일
  prfpdto: string; // 공연종료일
  poster: string; // 포스터이미지경로
  genrenm: string; // 장르
  prfstate: string; // 공연상태
  openrun: string; // 오픈런
  pcseguidance: string; // 가격
}

interface KopisResponse {
  dbs: {
    db: KopisEvent[] | KopisEvent;
  };
}

export async function getExhibitions(): Promise<Exhibition[]> {
  try {
    console.log("Fetching exhibitions..."); // 디버깅용 로그

    // 내부 API 라우트 호출 (절대 경로 사용)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
    const response = await fetch(`${baseUrl}/api/exhibitions`, {
      method: "GET",
      headers: {
        Accept: "application/xml",
      },
    });

    console.log("API Response status:", response.status); // 디버깅용 로그

    if (response.status === 404) {
      console.log("No exhibitions available");
      return [];
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(
        `Failed to fetch exhibitions: ${response.status} ${response.statusText}`
      );
    }

    const xmlText = await response.text();
    console.log("API Response XML:", xmlText); // 디버깅용 로그

    // 빈 응답 처리
    if (xmlText.includes("<dbs/>")) {
      console.log("Empty response from API");
      return [];
    }

    // XML을 JSON으로 변환
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    const data = xmlToJson(xmlDoc.documentElement) as KopisResponse;
    console.log("Converted JSON data:", data); // 디버깅용 로그

    if (!data.dbs?.db) {
      console.log("No exhibition data in response");
      return [];
    }

    // 배열이 아닌 경우 배열로 변환
    const exhibitions = Array.isArray(data.dbs.db)
      ? data.dbs.db
      : [data.dbs.db];

    // API 응답 데이터를 우리의 Exhibition 인터페이스 형식으로 변환
    return exhibitions.map((event) => ({
      id: event.mt20id || `${event.prfnm}-${event.prfpdfrom}`,
      title: event.prfnm || "제목 없음",
      place: event.fcltynm || "장소 미정",
      startDate: event.prfpdfrom?.replace(/\./g, "") || "",
      endDate: event.prfpdto?.replace(/\./g, "") || "",
      thumbnail: event.poster || "/images/placeholder.jpg",
      type: "전시",
      description: `${event.genrenm || "전시"} ${event.prfstate || ""}`,
      fee: "무료", // 전시는 보통 무료이거나 현장에서 확인
      category: event.genrenm || "전시",
    }));
  } catch (error) {
    console.error("Error fetching exhibitions:", error);
    throw error;
  }
}

// YYYYMMDD 형식의 날짜를 YYYY.MM.DD 형식으로 변환 (화면 표시용)
function formatDisplayDate(dateStr: string): string {
  if (!dateStr || dateStr.length !== 8) return "날짜 미정";
  return `${dateStr.slice(0, 4)}.${dateStr.slice(4, 6)}.${dateStr.slice(6, 8)}`;
}

// XML을 JSON으로 변환하는 유틸리티 함수
function xmlToJson(xml: Element): any {
  const result: any = {};

  if (xml.nodeType === Node.ELEMENT_NODE) {
    // 속성 처리
    if (xml.hasAttributes()) {
      result["@attributes"] = {};
      for (let i = 0; i < xml.attributes.length; i++) {
        const attribute = xml.attributes[i];
        result["@attributes"][attribute.nodeName] = attribute.nodeValue;
      }
    }

    // 자식 노드 처리
    if (xml.hasChildNodes()) {
      for (let i = 0; i < xml.childNodes.length; i++) {
        const item = xml.childNodes[i];
        const nodeName = item.nodeName;

        if (item.nodeType === Node.ELEMENT_NODE) {
          if (typeof result[nodeName] === "undefined") {
            result[nodeName] = xmlToJson(item as Element);
          } else {
            if (!Array.isArray(result[nodeName])) {
              const tmp = result[nodeName];
              result[nodeName] = [tmp];
            }
            result[nodeName].push(xmlToJson(item as Element));
          }
        } else if (item.nodeType === Node.TEXT_NODE) {
          const text = item.nodeValue?.trim();
          if (text) {
            result["#text"] = text;
          }
        }
      }
    }

    // 텍스트만 있는 경우 간단화
    if (Object.keys(result).length === 1 && result["#text"]) {
      return result["#text"];
    }
  }

  return result;
}
