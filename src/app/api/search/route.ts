import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const type = searchParams.get("type");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  try {
    const results: any = {
      naverBlogs: [],
      naverImages: [],
      kakaoBlogs: [],
      kakaoPlaces: [],
    };

    // 네이버 블로그 검색
    try {
      const naverBlogResponse = await axios.get(
        "https://openapi.naver.com/v1/search/blog",
        {
          params: {
            query: `${query} 팝업스토어`,
            display: 20,
            sort: "date",
          },
          headers: {
            "X-Naver-Client-Id": process.env.NEXT_PUBLIC_NAVER_CLIENT_ID,
            "X-Naver-Client-Secret":
              process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET,
          },
        }
      );
      results.naverBlogs = naverBlogResponse.data.items;
    } catch (error) {
      console.error("Error fetching Naver blogs:", error);
    }

    // 네이버 이미지 검색
    try {
      const naverImageResponse = await axios.get(
        "https://openapi.naver.com/v1/search/image",
        {
          params: {
            query: `${query} 팝업스토어`,
            display: 20,
            sort: "date",
            filter: "large",
          },
          headers: {
            "X-Naver-Client-Id": process.env.NEXT_PUBLIC_NAVER_CLIENT_ID,
            "X-Naver-Client-Secret":
              process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET,
          },
        }
      );

      // 이미지 검색 결과를 가공하여 웹페이지 URL 추가
      const blogSearchResponse = await axios.get(
        "https://openapi.naver.com/v1/search/blog",
        {
          params: {
            query: `${query} 팝업스토어`,
            display: 20,
            sort: "date",
          },
          headers: {
            "X-Naver-Client-Id": process.env.NEXT_PUBLIC_NAVER_CLIENT_ID,
            "X-Naver-Client-Secret":
              process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET,
          },
        }
      );

      // 이미지와 블로그 검색 결과를 매칭하여 웹페이지 URL 추가
      results.naverImages = naverImageResponse.data.items.map((item: any) => {
        // 이미지 제목과 가장 유사한 블로그 포스트 찾기
        const matchingBlog = blogSearchResponse.data.items.find(
          (blog: any) =>
            item.title.includes(blog.title) || blog.title.includes(item.title)
        );

        return {
          ...item,
          source: matchingBlog?.link || item.link, // 매칭되는 블로그 포스트가 있으면 해당 URL 사용, 없으면 이미지 URL 사용
        };
      });
    } catch (error) {
      console.error("Error fetching Naver images:", error);
    }

    // 카카오 장소 검색
    try {
      const kakaoPlaceResponse = await axios.get(
        "https://dapi.kakao.com/v2/local/search/keyword",
        {
          params: {
            query: `${query} 팝업스토어`,
            size: 15,
            category_group_code: "CT1",
          },
          headers: {
            Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}`,
          },
        }
      );
      results.kakaoPlaces = kakaoPlaceResponse.data.documents;
    } catch (error) {
      console.error("Error fetching Kakao places:", error);
    }

    // 카카오 블로그 검색
    try {
      const kakaoBlogResponse = await axios.get(
        "https://dapi.kakao.com/v2/search/blog",
        {
          params: {
            query: `${query} 팝업스토어`,
            size: 20,
            sort: "recency",
          },
          headers: {
            Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}`,
          },
        }
      );
      results.kakaoBlogs = kakaoBlogResponse.data.documents;
    } catch (error) {
      console.error("Error fetching Kakao blogs:", error);
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error in search API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
