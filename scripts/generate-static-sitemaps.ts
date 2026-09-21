import fs from 'fs';
import path from 'path';
import { getSegmentedSitemapXml, SITEMAP_SEGMENTS } from '../src/lib/seo/sitemapGenerator';

const publicDir = path.resolve(process.cwd(), 'public');

console.log('Generating static sitemap XML files in:', publicDir);

// 1. Generate the single canonical master index.
// The alias URLs (/sitemap_index.xml, /sitemap-index.xml) are served by server.ts from
// this same generator, so writing identical copies here only duplicates the file.
const masterIndexXml = getSegmentedSitemapXml('index');
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), masterIndexXml, 'utf-8');
console.log('✓ Generated public/sitemap.xml (master index)');

// 2. Generate each segmented sitemap
for (const seg of SITEMAP_SEGMENTS) {
  if (seg.id === 'index') continue;
  const segXml = getSegmentedSitemapXml(seg.id);
  const filePath = path.join(publicDir, seg.filename);
  fs.writeFileSync(filePath, segXml, 'utf-8');
  console.log(`✓ Generated public/${seg.filename} (${seg.name})`);
}

console.log('All static XML sitemaps generated successfully!');
