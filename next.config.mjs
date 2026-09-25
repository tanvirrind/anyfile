/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/legacy-sitemaps/sitemap.xml',
        destination: '/sitemap.xml',
        permanent: true,
      },
      {
        source: '/sitemap_index.xml',
        destination: '/sitemap.xml',
        permanent: true,
      },
      {
        source: '/sitemap-index.xml',
        destination: '/sitemap.xml',
        permanent: true,
      },
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
      {
        source: '/tool/:path*',
        destination: '/tools/:path*',
        permanent: true,
      },
      {
        source: '/guide/:path*',
        destination: '/guides/:path*',
        permanent: true,
      },
      {
        source: '/format/:path*',
        destination: '/file-extensions/:path*',
        permanent: true,
      },
      {
        source: '/formats/:path*',
        destination: '/file-extensions/:path*',
        permanent: true,
      },
      {
        source: '/format-guide/:path*',
        destination: '/file-extensions/:path*',
        permanent: true,
      },
      {
        source: '/format-guides/:path*',
        destination: '/file-extensions/:path*',
        permanent: true,
      },
      {
        source: '/technical/:path*',
        destination: '/security/:path*',
        permanent: true,
      },
      {
        source: '/authority/:path*',
        destination: '/security/:path*',
        permanent: true,
      },
      {
        source: '/mime/:path*',
        destination: '/mime-type/:path*',
        permanent: true,
      },
      {
        source: '/mime-types/:path*',
        destination: '/mime-type/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
