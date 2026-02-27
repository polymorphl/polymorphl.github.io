import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

interface LinkPreviewData {
  url: string;
  title: string;
  description: string;
  image: string | null;
  favicon: string | null;
  domain: string;
}

interface LinkPreviewMap {
  [url: string]: LinkPreviewData;
}

// Extract URLs from MDX files
function extractLinksFromMDX(dir: string): Set<string> {
  const links = new Set<string>();
  const files = fs.readdirSync(dir, { recursive: true });

  for (const file of files) {
    if (!file.toString().endsWith('.mdx')) continue;

    const filePath = path.join(dir, file.toString());
    const content = fs.readFileSync(filePath, 'utf-8');

    // Match <LinkPreview url="..." /> components
    const linkPreviewRegex = /<LinkPreview\s+url=["']([^"']+)["']/g;
    let match;

    while ((match = linkPreviewRegex.exec(content)) !== null) {
      links.add(match[1]);
    }
  }

  return links;
}

// Scrape Open Graph meta tags from URL
async function scrapeUrl(url: string): Promise<LinkPreviewData> {
  try {
    const response = await fetch(url, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkPreviewBot/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract domain for favicon
    const urlObj = new URL(url);
    const domain = urlObj.hostname;

    // Extract meta tags
    const title =
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('title').text() ||
      domain;

    const description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      $('meta[name="twitter:description"]').attr('content') ||
      '';

    const image =
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      null;

    // Try to construct favicon URL
    const faviconRel =
      $('link[rel="icon"]').attr('href') ||
      $('link[rel="shortcut icon"]').attr('href');

    let favicon = null;
    if (faviconRel) {
      try {
        favicon = new URL(faviconRel, url).href;
      } catch {
        // If favicon URL is invalid, use default
        favicon = `https://www.google.com/s2/favicons?sz=32&domain=${domain}`;
      }
    } else {
      favicon = `https://www.google.com/s2/favicons?sz=32&domain=${domain}`;
    }

    return {
      url,
      title: title.trim(),
      description: description.trim().substring(0, 150),
      image: image ? new URL(image, url).href : null,
      favicon,
      domain,
    };
  } catch (error) {
    console.warn(`⚠️ Failed to scrape ${url}: ${error}`);

    // Return fallback data
    const urlObj = new URL(url);
    const domain = urlObj.hostname || url;

    return {
      url,
      title: domain,
      description: '',
      image: null,
      favicon: `https://www.google.com/s2/favicons?sz=32&domain=${domain}`,
      domain,
    };
  }
}

// Main function
async function main() {
  console.log('🔗 Scanning MDX files for LinkPreview components...');

  const contentDir = path.join(process.cwd(), 'content', 'blog');
  const links = extractLinksFromMDX(contentDir);

  if (links.size === 0) {
    console.log('✅ No links found');
    // Create empty cache file
    const cacheDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
    fs.writeFileSync(
      path.join(cacheDir, 'link-previews.json'),
      JSON.stringify({}, null, 2)
    );
    return;
  }

  console.log(`Found ${links.size} unique links to scrape\n`);

  const previews: LinkPreviewMap = {};
  let completed = 0;

  for (const url of links) {
    process.stdout.write(`\r⏳ Scraping [${completed}/${links.size}] ${url.substring(0, 50)}...`);
    const preview = await scrapeUrl(url);
    previews[url] = preview;
    completed++;
    // Polite delay between requests
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  console.log(`\r✅ Scraped ${completed} links`);

  // Write cache to public directory
  const cacheDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

  const cacheFile = path.join(cacheDir, 'link-previews.json');
  fs.writeFileSync(cacheFile, JSON.stringify(previews, null, 2));

  console.log(`📁 Cache saved to ${path.relative(process.cwd(), cacheFile)}`);
}

main().catch((error) => {
  console.error('❌ Scraping failed:', error);
  process.exit(1);
});
