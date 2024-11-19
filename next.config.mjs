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
};

export default nextConfig;
