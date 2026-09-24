import fs from 'fs';
import path from 'path';
import { buildRouteManifest, PLATFORM_RELEASE_DATE } from '../src/lib/routes/routeManifest';

const publicDir = path.resolve(process.cwd(), 'public');
const segments = [
  { id: 'main', filename: 'sitemap-main.xml' },
  { id: 'images', filename: 'sitemap-images.xml' },
  { id: 'documents', filename: 'sitemap-documents.xml' },
  { id: 'archives', filename: 'sitemap-archives.xml' },
  { id: 'cad', filename: 'sitemap-cad.xml' },
  { id: 'programming', filename: 'sitemap-programming.xml' },
  { id: 'medical', filename: 'sitemap-medical.xml' },
  { id: 'video', filename: 'sitemap-video.xml' },
  { id: 'audio', filename: 'sitemap-audio.xml' },
  { id: 'how-to-open', filename: 'sitemap-how-to-open.xml' },
  { id: 'comparisons', filename: 'sitemap-comparisons.xml' },
  { id: 'converters', filename: 'sitemap-converters.xml' },
  { id: 'troubleshoot', filename: 'sitemap-troubleshoot.xml' },
  { id: 'security', filename: 'sitemap-security.xml' },
  { id: 'tools', filename: 'sitemap-tools.xml' },
  { id: 'mime-types', filename: 'sitemap-mime-types.xml' },
  { id: 'software', filename: 'sitemap-software.xml' },
  { id: 'guides', filename: 'sitemap-guides.xml' },
] as const;

const escapeXml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
const manifest = buildRouteManifest().filter((entry) => entry.isIndexable);

const renderUrlset = (entries: typeof manifest) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map((entry) => `  <url>
    <loc>${escapeXml(entry.canonicalUrl)}</loc>
    <lastmod>${PLATFORM_RELEASE_DATE}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>
  </url>`).join('\n')}
</urlset>
`;

for (const segment of segments) {
  const entries = manifest.filter((entry) => entry.sitemapSegment === segment.id);
  fs.writeFileSync(path.join(publicDir, segment.filename), renderUrlset(entries), 'utf8');
  console.log(`Generated ${segment.filename}: ${entries.length} URLs`);
}
console.log(`Generated ${manifest.length} URLs across ${segments.length} segmented sitemaps; /sitemap.xml is served by Next.js.`);
