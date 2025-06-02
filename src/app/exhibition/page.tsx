"use client";

import React, { useEffect, useState } from "react";

interface Exhibition {
  title: string;
  place: string;
  startDate: string;
  endDate: string;
  thumbnail: string;
  price: string;
}

const ExhibitionPage = () => {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        // 공공 API 엔드포인트로 교체 필요
        const response = await fetch('API_ENDPOINT_HERE');
        if (!response.ok) throw new Error('데이터를 불러오는데 실패했습니다');
        const data = await response.json();
        
        // API 응답 구조에 맞게 데이터 파싱 로직 수정 필요
        setExhibitions(data);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다');
        setIsLoading(false);
      }
    };

    fetchExhibitions();
  }, []);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">로딩중...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">전시회 목록</h1>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exhibitions.map((exhibition, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img 
              src={exhibition.thumbnail} 
              alt={exhibition.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{exhibition.title}</h2>
              <p className="text-gray-600 mb-2">{exhibition.place}</p>
              <p className="text-gray-600 mb-2">
                {exhibition.startDate} - {exhibition.endDate}
              </p>
              <p className="text-gray-800 font-medium">{exhibition.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExhibitionPage;
