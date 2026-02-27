import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const SITE_URL = 'https://polymorphl.github.io';
const DEFAULT_IMAGE = `${SITE_URL}/profile.webp`;

interface Frontmatter {
  title?: string;
  slug?: string;
  summary?: string;
  cover?: string;
  date?: string;
}

interface OpenGraphMeta {
  title: string;
  description: string;
  image: string;
  url: string;
  type: string;
}

// Generate Open Graph meta tags as HTML string
function generateOpenGraphTags(meta: OpenGraphMeta): string {
  return `
    <meta property="og:title" content="${escapeHtml(meta.title)}">
    <meta property="og:description" content="${escapeHtml(meta.description)}">
    <meta property="og:image" content="${escapeHtml(meta.image)}">
    <meta property="og:url" content="${escapeHtml(meta.url)}">
    <meta property="og:type" content="${meta.type}">
    <meta property="og:site_name" content="Luc TERRACHER">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(meta.title)}">
    <meta name="twitter:description" content="${escapeHtml(meta.description)}">
    <meta name="twitter:image" content="${escapeHtml(meta.image)}">
  `;
}

// Escape HTML special characters
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

// Generate HTML file with Open Graph tags
function generateHtmlFile(meta: OpenGraphMeta, outputPath: string): void {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(meta.title)}</title>
  <meta name="description" content="${escapeHtml(meta.description)}">
  ${generateOpenGraphTags(meta)}
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <!-- Redirect to main app after meta tags are read -->
  <script>
    // Give crawlers time to read meta tags before redirecting
    window.location.replace('${escapeHtml(meta.url)}');
  </script>
  <!-- Fallback link for users with JS disabled -->
  <noscript>
    <meta http-equiv="refresh" content="0; url=${escapeHtml(meta.url)}">
  </noscript>
</head>
<body>
  <p>Redirecting to article...</p>
</body>
</html>`;

  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(outputPath, html);
}

// Scan MDX files and extract frontmatter with language
interface PostWithLang extends Frontmatter {
  lang: 'en' | 'fr';
}

function scanBlogFiles(): Map<string, PostWithLang> {
  const contentDir = path.join(process.cwd(), 'content', 'blog');
  const posts = new Map<string, PostWithLang>();

  if (!fs.existsSync(contentDir)) {
    console.warn(`⚠️ Content directory not found: ${contentDir}`);
    return posts;
  }

  const files = fs.readdirSync(contentDir, { recursive: true });

  for (const file of files) {
    const filePath = file.toString();
    if (!filePath.endsWith('.mdx')) continue;

    // Extract language from filename (e.g., "file.en.mdx" or "file.fr.mdx")
    const langMatch = filePath.match(/\.(en|fr)\.mdx$/);
    if (!langMatch) continue;

    const lang = langMatch[1] as 'en' | 'fr';
    const fullPath = path.join(contentDir, filePath);
    const content = fs.readFileSync(fullPath, 'utf-8');
    const { data } = matter(content);

    const slug = data.slug || path.parse(filePath).name.replace(/\.(en|fr)$/, '');
    const key = `${slug}__${lang}`;
    posts.set(key, { ...(data as Frontmatter), lang });
  }

  return posts;
}

// Main function
function main() {
  console.log('🔍 Generating Open Graph pages for blog posts...\n');

  const posts = scanBlogFiles();
  let count = 0;

  for (const [key, post] of posts) {
    const { title, summary, cover, lang } = post;

    if (!title) {
      console.warn(`⚠️ Skipping ${key}: missing title`);
      continue;
    }

    // Generate URLs with language prefix
    const articleUrl = `${SITE_URL}/${lang}/blog/${key.split('__')[0]}`;
    const description = (summary || '').substring(0, 160) || title;
    const image = cover ? `${SITE_URL}${cover}` : DEFAULT_IMAGE;

    const ogMeta: OpenGraphMeta = {
      title,
      description,
      image,
      url: articleUrl,
      type: 'article',
    };

    // Generate HTML file with language prefix: /en/blog/slug/ or /fr/blog/slug/
    const outputPath = path.join(process.cwd(), 'dist', lang, 'blog', key.split('__')[0], 'index.html');
    generateHtmlFile(ogMeta, outputPath);

    console.log(`✅ Generated: /${lang}/blog/${key.split('__')[0]}`);
    console.log(`   Title: ${title}`);
    console.log(`   Image: ${image}\n`);

    count++;
  }

  console.log(`\n📄 Generated ${count} Open Graph pages`);
}

main();
