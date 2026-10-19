import createNextIntlPlugin from 'next-intl/plugin';

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
      {
        source: '/sw.js',
        headers: [
          { key: 'Service-Worker-Allowed', value: '/' },
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
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
      // --- Duplicate guide consolidation (2026-10-18): retired -guide
      // variants 301 to their canonical bare-slug twins (EN + ES). ---
      {
        source: '/guides/are-online-file-converters-safe-guide',
        destination: '/guides/are-online-file-converters-safe',
        permanent: true,
      },
      {
        source: '/guides/batch-convert-images-guide',
        destination: '/guides/batch-convert-images',
        permanent: true,
      },
      {
        source: '/guides/convert-files-without-uploading-guide',
        destination: '/guides/convert-files-without-uploading',
        permanent: true,
      },
      {
        source: '/guides/fat32-vs-exfat-vs-ntfs-guide',
        destination: '/guides/fat32-vs-exfat-vs-ntfs',
        permanent: true,
      },
      {
        source: '/guides/mp3-vs-wav-vs-flac-guide',
        destination: '/guides/mp3-vs-wav-vs-flac',
        permanent: true,
      },
      {
        source: '/guides/open-file-no-extension-guide',
        destination: '/guides/open-file-no-extension',
        permanent: true,
      },
      {
        source: '/guides/play-mkv-on-iphone-guide',
        destination: '/guides/play-mkv-on-iphone',
        permanent: true,
      },
      {
        source: '/guides/png-vs-jpg-vs-webp-guide',
        destination: '/guides/png-vs-jpg-vs-webp',
        permanent: true,
      },
      {
        source: '/guides/read-epub-on-kindle-guide',
        destination: '/guides/read-epub-on-kindle',
        permanent: true,
      },
      {
        source: '/guides/what-is-a-file-extension-guide',
        destination: '/guides/what-is-a-file-extension',
        permanent: true,
      },
      {
        source: '/guides/what-is-a-video-container-format-guide',
        destination: '/guides/what-is-a-video-container-format',
        permanent: true,
      },
      {
        source: '/guides/what-is-exif-data-guide',
        destination: '/guides/what-is-exif-data',
        permanent: true,
      },
      {
        source: '/es/guides/are-online-file-converters-safe-guide',
        destination: '/es/guides/are-online-file-converters-safe',
        permanent: true,
      },
      {
        source: '/es/guides/batch-convert-images-guide',
        destination: '/es/guides/batch-convert-images',
        permanent: true,
      },
      {
        source: '/es/guides/convert-files-without-uploading-guide',
        destination: '/es/guides/convert-files-without-uploading',
        permanent: true,
      },
      {
        source: '/es/guides/fat32-vs-exfat-vs-ntfs-guide',
        destination: '/es/guides/fat32-vs-exfat-vs-ntfs',
        permanent: true,
      },
      {
        source: '/es/guides/mp3-vs-wav-vs-flac-guide',
        destination: '/es/guides/mp3-vs-wav-vs-flac',
        permanent: true,
      },
      {
        source: '/es/guides/open-file-no-extension-guide',
        destination: '/es/guides/open-file-no-extension',
        permanent: true,
      },
      {
        source: '/es/guides/play-mkv-on-iphone-guide',
        destination: '/es/guides/play-mkv-on-iphone',
        permanent: true,
      },
      {
        source: '/es/guides/png-vs-jpg-vs-webp-guide',
        destination: '/es/guides/png-vs-jpg-vs-webp',
        permanent: true,
      },
      {
        source: '/es/guides/read-epub-on-kindle-guide',
        destination: '/es/guides/read-epub-on-kindle',
        permanent: true,
      },
      {
        source: '/es/guides/what-is-a-file-extension-guide',
        destination: '/es/guides/what-is-a-file-extension',
        permanent: true,
      },
      {
        source: '/es/guides/what-is-a-video-container-format-guide',
        destination: '/es/guides/what-is-a-video-container-format',
        permanent: true,
      },
      {
        source: '/es/guides/what-is-exif-data-guide',
        destination: '/es/guides/what-is-exif-data',
        permanent: true,
      },
      // --- Duplicate tool twins (2026-10-19): /tools/<converter-slug> pages
      // render the identical ConverterUploadBox as their /converters/ twins.
      // Retire the /tools/ side (EN + ES) to the keyword canonicals. ---
      { source: '/tools/docx-to-pdf', destination: '/converters/docx-to-pdf', permanent: true },
      { source: '/es/tools/docx-to-pdf', destination: '/es/converters/docx-to-pdf', permanent: true },
      { source: '/tools/eml-to-pdf', destination: '/converters/eml-to-pdf', permanent: true },
      { source: '/es/tools/eml-to-pdf', destination: '/es/converters/eml-to-pdf', permanent: true },
      { source: '/tools/heic-to-jpg', destination: '/converters/heic-to-jpg', permanent: true },
      { source: '/es/tools/heic-to-jpg', destination: '/es/converters/heic-to-jpg', permanent: true },
      { source: '/tools/heic-to-png', destination: '/converters/heic-to-png', permanent: true },
      { source: '/es/tools/heic-to-png', destination: '/es/converters/heic-to-png', permanent: true },
      { source: '/tools/jpg-to-png', destination: '/converters/jpg-to-png', permanent: true },
      { source: '/es/tools/jpg-to-png', destination: '/es/converters/jpg-to-png', permanent: true },
      { source: '/tools/jpg-to-webp', destination: '/converters/jpg-to-webp', permanent: true },
      { source: '/es/tools/jpg-to-webp', destination: '/es/converters/jpg-to-webp', permanent: true },
      { source: '/tools/pdf-to-jpg', destination: '/converters/pdf-to-jpg', permanent: true },
      { source: '/es/tools/pdf-to-jpg', destination: '/es/converters/pdf-to-jpg', permanent: true },
      { source: '/tools/pdf-to-png', destination: '/converters/pdf-to-png', permanent: true },
      { source: '/es/tools/pdf-to-png', destination: '/es/converters/pdf-to-png', permanent: true },
      { source: '/tools/png-to-jpg', destination: '/converters/png-to-jpg', permanent: true },
      { source: '/es/tools/png-to-jpg', destination: '/es/converters/png-to-jpg', permanent: true },
      { source: '/tools/png-to-webp', destination: '/converters/png-to-webp', permanent: true },
      { source: '/es/tools/png-to-webp', destination: '/es/converters/png-to-webp', permanent: true },
      { source: '/tools/webp-to-jpg', destination: '/converters/webp-to-jpg', permanent: true },
      { source: '/es/tools/webp-to-jpg', destination: '/es/converters/webp-to-jpg', permanent: true },
      { source: '/tools/pptx-to-pdf', destination: '/converters/pptx-to-pdf', permanent: true },
      { source: '/es/tools/pptx-to-pdf', destination: '/es/converters/pptx-to-pdf', permanent: true },
      { source: '/tools/svg-to-jpg', destination: '/converters/svg-to-jpg', permanent: true },
      { source: '/es/tools/svg-to-jpg', destination: '/es/converters/svg-to-jpg', permanent: true },
      { source: '/tools/svg-to-png', destination: '/converters/svg-to-png', permanent: true },
      { source: '/es/tools/svg-to-png', destination: '/es/converters/svg-to-png', permanent: true },
      { source: '/tools/webp-to-png', destination: '/converters/webp-to-png', permanent: true },
      { source: '/es/tools/webp-to-png', destination: '/es/converters/webp-to-png', permanent: true },
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

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

export default withNextIntl(nextConfig);
