/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "nafyopizhmmgxzbjaejy.supabase.co",
      },
      {
        hostname: "www.static-src.com",
      },
      {
        hostname: "qhsdnskiusrydliavrxp.supabase.co",
      }
    ],
  },
  async headers(){
    return [
      {
        source: "/api/(.*)",

        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.DOMAIN_NAME ||"*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          }
        ]
      }
    ]
  }
};

export default nextConfig;
