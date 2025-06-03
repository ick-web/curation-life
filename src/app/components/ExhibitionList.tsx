import React from "react";
import Image from "next/image";

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

interface ExhibitionListProps {
  exhibitions: Exhibition[];
  isLoading: boolean;
  error?: string;
}

export default function ExhibitionList({
  exhibitions,
  isLoading,
  error,
}: ExhibitionListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!exhibitions.length) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-gray-500">검색 결과가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {exhibitions.map((exhibition) => (
        <div
          key={exhibition.mt20id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <div className="relative h-[400px]">
            <Image
              src={exhibition.poster}
              alt={exhibition.prfnm}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">
              {exhibition.prfnm}
            </h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>
                {exhibition.prfpdfrom} ~ {exhibition.prfpdto}
              </p>
              <p>{exhibition.fcltynm}</p>
              <p>{exhibition.area}</p>
              <div className="flex gap-2 mt-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                  {exhibition.genrenm}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    exhibition.prfstate === "공연예정"
                      ? "bg-green-100 text-green-800"
                      : exhibition.prfstate === "공연중"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {exhibition.prfstate}
                </span>
                {exhibition.openrun === "Y" && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                    오픈런
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
