/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "www.kopis.or.kr",
      "search.pstatic.net",
      "k.kakaocdn.net",
      "culture.seoul.go.kr",
    ],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "www.kopis.or.kr",
        port: "",
        pathname: "/upload/pfmPoster/**",
      },
      {
        protocol: "https",
        hostname: "search.pstatic.net",
        port: "",
        pathname: "/thumb/**",
      },
      {
        protocol: "https",
        hostname: "k.kakaocdn.net",
        port: "",
        pathname: "/dn/**",
      },
      {
        protocol: "https",
        hostname: "culture.seoul.go.kr",
        port: "",
        pathname: "/cmmn/file/**",
      },
    ],
  },
};

module.exports = nextConfig;
