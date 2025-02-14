/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  // Optional: Add any additional configuration
  async redirects() {
    return [
      {
        source: '/',
        destination: '/auth',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
