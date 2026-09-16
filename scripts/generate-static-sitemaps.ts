import fs from 'fs';
import path from 'path';
import { getSegmentedSitemapXml, SITEMAP_SEGMENTS } from '../src/lib/seo/sitemapGenerator';

const publicDir = path.resolve(process.cwd(), 'public');

console.log('Generating static sitemap XML files in:', publicDir);

// 1. Generate master index sitemap.xml
const masterIndexXml = getSegmentedSitemapXml('index');
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), masterIndexXml, 'utf-8');
fs.writeFileSync(path.join(publicDir, 'sitemap_index.xml'), masterIndexXml, 'utf-8');
fs.writeFileSync(path.join(publicDir, 'sitemap-index.xml'), masterIndexXml, 'utf-8');
console.log('✓ Generated public/sitemap.xml and aliases');

// 2. Generate each segmented sitemap
for (const seg of SITEMAP_SEGMENTS) {
  if (seg.id === 'index') continue;
  const segXml = getSegmentedSitemapXml(seg.id);
  const filePath = path.join(publicDir, seg.filename);
  fs.writeFileSync(filePath, segXml, 'utf-8');
  console.log(`✓ Generated public/${seg.filename} (${seg.name})`);
}

console.log('All static XML sitemaps generated successfully!');
