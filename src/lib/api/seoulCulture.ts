import axios from "axios";
import type {
  SeoulCultureEvent,
  NaverSearchItem,
  NaverImageItem,
  KakaoSearchItem,
  KakaoPlaceItem,
} from "@/types/seoulCulture";

const SEOUL_API_KEY = process.env.NEXT_PUBLIC_SEOUL_API_KEY;
const NAVER_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET;
const KAKAO_REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;

// 서울시 문화행사 API
export const fetchSeoulCultureEvents = async (params: {
  start_date?: string;
  end_date?: string;
  type?: string;
}) => {
  try {
    const response = await axios.get(
      `http://openapi.seoul.go.kr:8088/${SEOUL_API_KEY}/json/culturalEventInfo/1/100`,
      { params }
    );
    return response.data.culturalEventInfo.row as SeoulCultureEvent[];
  } catch (error) {
    console.error("Error fetching Seoul culture events:", error);
    return [];
  }
};

// 네이버 블로그 검색 API
export const searchNaverBlogs = async (query: string) => {
  try {
    const response = await axios.get(
      "https://openapi.naver.com/v1/search/blog",
      {
        params: {
          query: `${query} 팝업스토어`,
          display: 20,
          sort: "date",
        },
        headers: {
          "X-Naver-Client-Id": NAVER_CLIENT_ID,
          "X-Naver-Client-Secret": NAVER_CLIENT_SECRET,
        },
      }
    );
    return response.data.items as NaverSearchItem[];
  } catch (error) {
    console.error("Error searching Naver blogs:", error);
    return [];
  }
};

// 네이버 이미지 검색 API
export const searchNaverImages = async (query: string) => {
  try {
    const response = await axios.get(
      "https://openapi.naver.com/v1/search/image",
      {
        params: {
          query: `${query} 팝업스토어`,
          display: 20,
          sort: "date",
        },
        headers: {
          "X-Naver-Client-Id": NAVER_CLIENT_ID,
          "X-Naver-Client-Secret": NAVER_CLIENT_SECRET,
        },
      }
    );
    return response.data.items as NaverImageItem[];
  } catch (error) {
    console.error("Error searching Naver images:", error);
    return [];
  }
};

// 카카오 블로그 검색 API
export const searchKakaoBlogs = async (query: string) => {
  try {
    const response = await axios.get("https://dapi.kakao.com/v2/search/blog", {
      params: {
        query: `${query} 팝업스토어`,
        size: 20,
        sort: "recency",
      },
      headers: {
        Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
      },
    });
    return response.data.documents as KakaoSearchItem[];
  } catch (error) {
    console.error("Error searching Kakao blogs:", error);
    return [];
  }
};

// 카카오 장소 검색 API
export const searchKakaoPlaces = async (query: string) => {
  try {
    const response = await axios.get(
      "https://dapi.kakao.com/v2/local/search/keyword",
      {
        params: {
          query: `${query} 팝업스토어`,
          size: 15,
          category_group_code: "CT1", // 문화시설
        },
        headers: {
          Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
        },
      }
    );
    return response.data.documents as KakaoPlaceItem[];
  } catch (error) {
    console.error("Error searching Kakao places:", error);
    return [];
  }
};

// 통합 검색 API 호출
export const searchAllCultureEvents = async (params: {
  start_date?: string;
  end_date?: string;
  type?: string;
  query?: string;
}) => {
  try {
    // 서울시 문화행사 API 호출
    const seoulEvents = await fetchSeoulCultureEvents(params);

    // 팝업스토어 관련 검색 (POPUP 타입일 때만)
    let popupStores = {
      naverBlogs: [],
      naverImages: [],
      kakaoBlogs: [],
      kakaoPlaces: [],
    };

    if (params.type === "POPUP" && params.query) {
      const searchResponse = await fetch(
        `/api/search?query=${encodeURIComponent(params.query)}`
      );
      if (searchResponse.ok) {
        popupStores = await searchResponse.json();
      }
    }

    return {
      exhibitions: seoulEvents.filter((event) =>
        event.CODENAME.includes("전시")
      ),
      performances: seoulEvents.filter((event) =>
        event.CODENAME.includes("공연")
      ),
      popupStores,
    };
  } catch (error) {
    console.error("Error in searchAllCultureEvents:", error);
    return {
      exhibitions: [],
      performances: [],
      popupStores: {
        naverBlogs: [],
        naverImages: [],
        kakaoBlogs: [],
        kakaoPlaces: [],
      },
    };
  }
};
