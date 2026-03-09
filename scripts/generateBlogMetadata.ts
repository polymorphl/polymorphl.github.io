import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface Frontmatter {
  title?: string;
  slug?: string;
  date?: string;
  excerpt?: string;
  summary?: string;
  tags?: string[];
  cover?: string;
  readingTime?: number;
}

interface PostMeta {
  slug: string;
  lang: 'en' | 'fr';
  fileBase: string;
  path: string;
  title: string;
  date: string;
  excerpt: string;
  summary?: string;
  tags?: string[];
  cover?: string;
  readingTime?: number;
}

interface BlogMetadata {
  posts: PostMeta[];
  slugToPath: Record<string, string>;
  fileBaseToSlug: Record<string, Partial<Record<'en' | 'fr', string>>>;
  slugToFileBase: Record<string, string>;
}

function scanBlogFiles(): PostMeta[] {
  const contentDir = path.join(process.cwd(), 'content', 'blog');
  const posts: PostMeta[] = [];

  if (!fs.existsSync(contentDir)) {
    console.warn(`⚠️ Content directory not found: ${contentDir}`);
    return posts;
  }

  const files = fs.readdirSync(contentDir, { recursive: true });

  for (const file of files) {
    const filePath = file.toString();
    if (!filePath.endsWith('.mdx')) continue;

    const langMatch = filePath.match(/\.(en|fr)\.mdx$/);
    if (!langMatch) continue;

    const lang = langMatch[1] as 'en' | 'fr';
    const fullPath = path.join(contentDir, filePath);
    const content = fs.readFileSync(fullPath, 'utf-8');
    const { data } = matter(content);

    const fileBase = path.parse(filePath).name.replace(/\.(en|fr)$/, '');
    const slug = (data as Frontmatter).slug || fileBase;

    // Path format must match Vite's import.meta.glob keys: /content/blog/...
    const globPath = `/content/blog/${filePath.replace(/\\/g, '/')}`;

    posts.push({
      slug,
      lang,
      fileBase,
      path: globPath,
      title: (data as Frontmatter).title ?? 'Untitled',
      date: (data as Frontmatter).date ?? '',
      excerpt: (data as Frontmatter).excerpt ?? '',
      summary: (data as Frontmatter).summary,
      tags: (data as Frontmatter).tags,
      cover: (data as Frontmatter).cover,
      readingTime: (data as Frontmatter).readingTime,
    });
  }

  return posts.sort((a, b) => (b.date > a.date ? 1 : -1));
}

function buildMetadata(posts: PostMeta[]): BlogMetadata {
  const slugToPath: Record<string, string> = {};
  const fileBaseToSlug: Record<string, Partial<Record<'en' | 'fr', string>>> = {};
  const slugToFileBase: Record<string, string> = {};

  for (const post of posts) {
    slugToPath[`${post.slug}__${post.lang}`] = post.path;
    fileBaseToSlug[post.fileBase] = fileBaseToSlug[post.fileBase] ?? {};
    fileBaseToSlug[post.fileBase][post.lang] = post.slug;
    slugToFileBase[post.slug] = post.fileBase;
  }

  return {
    posts,
    slugToPath,
    fileBaseToSlug,
    slugToFileBase,
  };
}

function main() {
  console.log('📝 Generating blog metadata...\n');

  const posts = scanBlogFiles();
  const metadata = buildMetadata(posts);

  const outputDir = path.join(process.cwd(), 'src', 'generated');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, 'blog-metadata.json');
  fs.writeFileSync(outputPath, JSON.stringify(metadata, null, 2), 'utf-8');

  console.log(`✅ Generated ${posts.length} post(s) → ${outputPath}`);
}

main();
