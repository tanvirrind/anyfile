/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: '/what-is-:ext',
        destination: '/file-extensions/:ext',
        permanent: true,
      },
      {
        source: '/extension/:path*',
        destination: '/file-extensions/:path*',
        permanent: true,
      },
      {
        source: '/extensions/:path*',
        destination: '/file-extensions/:path*',
        permanent: true,
      },
      {
        source: '/file-extension/:path*',
        destination: '/file-extensions/:path*',
        permanent: true,
      },
      {
        source: '/converter/:path*',
        destination: '/converters/:path*',
        permanent: true,
      },
      {
        source: '/repair/:path*',
        destination: '/troubleshoot/:path*',
        permanent: true,
      },
      {
        source: '/troubleshooting/:path*',
        destination: '/troubleshoot/:path*',
        permanent: true,
      },
      {
        source: '/resources/:path*',
        destination: '/guides/:path*',
        permanent: true,
      },
      {
        source: '/comparison/:path*',
        destination: '/compare/:path*',
        permanent: true,
      },
      {
        source: '/categories/:path*',
        destination: '/category/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
