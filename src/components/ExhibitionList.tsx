import { useState, useEffect } from "react";
import { searchAllCultureEvents } from "@/lib/api/seoulCulture";
import { CultureEventType } from "@/types/seoulCulture";
import Image from "next/image";
import { format } from "date-fns";

const EventTypeTab = ({
  type,
  activeType,
  onChange,
}: {
  type: CultureEventType;
  activeType: CultureEventType;
  onChange: (type: CultureEventType) => void;
}) => (
  <button
    className={`px-6 py-3 rounded-full transition-all duration-300 ${
      activeType === type
        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
        : "bg-white text-gray-600 hover:bg-gray-50"
    }`}
    onClick={() => onChange(type)}
  >
    {type}
  </button>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-[400px]">
    <div className="relative w-16 h-16">
      <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full"></div>
      <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
    </div>
  </div>
);

export default function ExhibitionList() {
  const [activeType, setActiveType] = useState<CultureEventType>("EXHIBITION");
  const [events, setEvents] = useState<any>({
    exhibitions: [],
    performances: [],
    popupStores: {
      naverBlogs: [],
      naverImages: [],
      kakaoBlogs: [],
      kakaoPlaces: [],
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const today = format(new Date(), "yyyyMMdd");
      const result = await searchAllCultureEvents({
        start_date: today,
        type: activeType,
        query: activeType === "POPUP" ? "서울 팝업스토어" : undefined,
      });
      setEvents(result);
      setLoading(false);
    };

    fetchEvents();
  }, [activeType]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4">
      <div className="flex gap-4 mb-12 overflow-x-auto pb-4 scrollbar-hide">
        <EventTypeTab
          type="EXHIBITION"
          activeType={activeType}
          onChange={setActiveType}
        />
        <EventTypeTab
          type="PERFORMANCE"
          activeType={activeType}
          onChange={setActiveType}
        />
        <EventTypeTab
          type="POPUP"
          activeType={activeType}
          onChange={setActiveType}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activeType === "EXHIBITION" &&
          events.exhibitions.map((event: any) => (
            <div
              key={event.TITLE}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {event.MAIN_IMG && (
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={event.MAIN_IMG}
                    alt={event.TITLE}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  {event.TITLE}
                </h3>
                <p className="text-gray-600 mb-3">{event.PLACE}</p>
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>
                    {format(new Date(event.STRTDATE), "yyyy.MM.dd")} ~{" "}
                    {format(new Date(event.END_DATE), "yyyy.MM.dd")}
                  </span>
                </div>
                {event.USE_FEE && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{event.USE_FEE}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

        {activeType === "POPUP" && (
          <>
            <div className="col-span-full">
              <h2 className="text-2xl font-bold mb-8 pb-4 border-b border-gray-200">
                현재 운영 중인 팝업스토어
              </h2>
            </div>
            {events.popupStores.kakaoPlaces.map((place: any) => (
              <div
                key={place.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6"
              >
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  {place.place_name}
                </h3>
                <div className="space-y-3">
                  <p className="flex items-center gap-2 text-gray-600">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {place.road_address_name}
                  </p>
                  <p className="flex items-center gap-2 text-gray-500">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                      />
                    </svg>
                    {place.category_name}
                  </p>
                  {place.phone && (
                    <p className="flex items-center gap-2 text-gray-600">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      {place.phone}
                    </p>
                  )}
                  <a
                    href={place.place_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors mt-2"
                  >
                    <span>상세정보 보기</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            ))}

            <div className="col-span-full mt-12">
              <h2 className="text-2xl font-bold mb-8 pb-4 border-b border-gray-200">
                팝업스토어 갤러리
              </h2>
            </div>
            {events.popupStores.naverImages.map((image: any) => (
              <div
                key={image.link}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={image.thumbnail}
                    alt={image.title}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3
                    className="text-lg font-semibold mb-3 line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: image.title }}
                  />
                  <div className="flex flex-col gap-2">
                    <a
                      href={image.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      <span>웹페이지 방문하기</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                    <a
                      href={image.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-600 transition-colors text-sm"
                    >
                      <span>원본 이미지 보기</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}

            <div className="col-span-full mt-12">
              <h2 className="text-2xl font-bold mb-8 pb-4 border-b border-gray-200">
                블로그 리뷰
              </h2>
            </div>
            {events.popupStores.naverBlogs
              .concat(events.popupStores.kakaoBlogs)
              .map((post: any, index: number) => {
                const isNaver = "bloggerlink" in post;
                const uniqueKey = isNaver
                  ? `naver-${post.link}`
                  : `kakao-${post.url}-${index}`;

                // 블로그 링크 정확하게 가져오기
                const blogUrl = isNaver ? post.link : post.url;
                // 블로그 이름 가져오기
                const bloggerName = isNaver ? post.bloggername : post.blogname;
                // 날짜 가져오기
                const postDate = isNaver
                  ? post.postdate
                  : format(new Date(post.datetime), "yyyy.MM.dd");
                // 내용 가져오기
                const content = isNaver ? post.description : post.contents;

                return (
                  <div
                    key={uniqueKey}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6"
                  >
                    <h3
                      className="text-xl font-bold mb-3"
                      dangerouslySetInnerHTML={{ __html: post.title }}
                    />
                    <p
                      className="text-gray-600 mb-4 line-clamp-3"
                      dangerouslySetInnerHTML={{
                        __html: content,
                      }}
                    />
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        {bloggerName}
                      </span>
                      <span className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {postDate}
                      </span>
                    </div>
                    <a
                      href={blogUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors mt-4"
                    >
                      <span>블로그 방문하기</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                );
              })}
          </>
        )}
      </div>
    </div>
  );
}
