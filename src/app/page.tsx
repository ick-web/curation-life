"use client";

import { useState, useEffect } from "react";
import ExhibitionFilters from "./components/ExhibitionFilters";
import ExhibitionList from "@/components/ExhibitionList";

interface Exhibition {
  mt20id: string;
  prfnm: string;
  prfpdfrom: string;
  prfpdto: string;
  fcltynm: string;
  poster: string;
  area: string;
  genrenm: string;
  openrun: string;
  prfstate: string;
}

export default function Home() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  const fetchExhibitions = async (filters?: {
    startDate?: string;
    endDate?: string;
    region?: string;
    status?: string;
  }) => {
    try {
      setIsLoading(true);
      setError(undefined);

      // URL 파라미터 구성
      const params = new URLSearchParams();
      if (filters?.startDate) params.append("startDate", filters.startDate);
      if (filters?.endDate) params.append("endDate", filters.endDate);
      if (filters?.region) params.append("region", filters.region);
      if (filters?.status) params.append("status", filters.status);

      const response = await fetch(`/api/exhibitions?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "데이터를 불러오는데 실패했습니다.");
      }

      setExhibitions(data.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExhibitions();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-black">
        <div
          className="absolute inset-0 opacity-50 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1536924940846-227afb31e2a5?q=80&w=2066&auto=format&fit=crop')`,
          }}
        ></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            Curation Life
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light">
            당신의 문화생활을 더 특별하게
          </p>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-200">
            전시회부터 팝업스토어까지, 서울의 모든 문화 이벤트를 한눈에
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">전시 정보</h3>
            <p className="text-gray-600">
              서울시 곳곳의 다양한 전시회 정보를 한눈에 확인하세요.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-purple-600"
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
            </div>
            <h3 className="text-xl font-semibold mb-2">팝업스토어</h3>
            <p className="text-gray-600">
              트렌디한 팝업스토어의 위치와 정보를 실시간으로 확인하세요.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-pink-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">실시간 리뷰</h3>
            <p className="text-gray-600">
              방문자들의 생생한 후기와 추천을 확인해보세요.
            </p>
          </div>
        </div>

        {/* Exhibition List Component */}
        <div className="mt-8">
          <ExhibitionList />
        </div>
      </section>
    </main>
  );
}
