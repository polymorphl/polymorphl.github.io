import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://polymorphl.github.io';

interface PostMeta {
  slug: string;
  lang: 'en' | 'fr';
  date: string;
}

interface BlogMetadata {
  posts: PostMeta[];
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatDateForSitemap(dateStr: string): string {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? new Date().toISOString().split('T')[0] : d.toISOString().split('T')[0];
}

function main() {
  console.log('🗺️  Generating sitemap.xml...\n');

  const metadataPath = path.join(process.cwd(), 'src', 'generated', 'blog-metadata.json');
  if (!fs.existsSync(metadataPath)) {
    console.error('❌ blog-metadata.json not found. Run generate:blog-metadata first.');
    process.exit(1);
  }

  const { posts } = JSON.parse(fs.readFileSync(metadataPath, 'utf-8')) as BlogMetadata;

  const urls: { loc: string; lastmod?: string; priority?: string; changefreq?: string }[] = [
    { loc: `${SITE_URL}/`, lastmod: formatDateForSitemap(''), priority: '1.0', changefreq: 'weekly' },
    { loc: `${SITE_URL}/blog`, lastmod: formatDateForSitemap(''), priority: '0.9', changefreq: 'weekly' },
    { loc: `${SITE_URL}/en/blog`, lastmod: formatDateForSitemap(''), priority: '0.9', changefreq: 'weekly' },
    { loc: `${SITE_URL}/fr/blog`, lastmod: formatDateForSitemap(''), priority: '0.9', changefreq: 'weekly' },
  ];

  for (const post of posts) {
    urls.push({
      loc: `${SITE_URL}/${post.lang}/blog/${post.slug}`,
      lastmod: formatDateForSitemap(post.date),
      priority: '0.8',
      changefreq: 'monthly',
    });
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  const outputPath = path.join(process.cwd(), 'dist', 'sitemap.xml');
  const distDir = path.dirname(outputPath);
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  fs.writeFileSync(outputPath, sitemap, 'utf-8');

  console.log(`✅ Generated sitemap.xml with ${urls.length} URL(s) → dist/sitemap.xml`);
}

main();
