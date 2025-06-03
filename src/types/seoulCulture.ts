export interface SeoulCultureEvent {
  TITLE: string; // 행사명
  CODENAME: string; // 분류
  DATE: string; // 행사일자
  PLACE: string; // 장소
  ORG_NAME: string; // 기관명
  USE_TRGT: string; // 이용대상
  USE_FEE: string; // 이용요금
  PLAYER: string; // 출연자
  PROGRAM: string; // 프로그램
  ETC_DESC: string; // 기타내용
  ORG_LINK: string; // 홈페이지 주소
  MAIN_IMG: string; // 대표이미지
  RGSTDATE: string; // 등록일
  TICKET: string; // 예매링크
  STRTDATE: string; // 시작일자
  END_DATE: string; // 종료일자
  THEMECODE: string; // 테마분류
}

export interface NaverSearchItem {
  title: string;
  link: string;
  description: string;
  bloggername?: string;
  bloggerlink?: string;
  postdate?: string;
  address?: string;
  mapx?: string;
  mapy?: string;
}

export interface NaverImageItem {
  title: string;
  link: string;
  thumbnail: string;
  sizeheight: string;
  sizewidth: string;
}

export interface KakaoSearchItem {
  title: string;
  contents: string;
  url: string;
  blogname?: string;
  thumbnail?: string;
  datetime: string;
}

export interface KakaoPlaceItem {
  id: string;
  place_name: string;
  category_name: string;
  address_name: string;
  road_address_name: string;
  phone: string;
  place_url: string;
  x: string; // longitude
  y: string; // latitude
}

export type CultureEventType =
  | "PERFORMANCE"
  | "EXHIBITION"
  | "POPUP"
  | "FESTIVAL"
  | "OTHER";
