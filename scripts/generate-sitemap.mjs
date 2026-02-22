#!/usr/bin/env node
/**
 * generate-sitemap.mjs — generates sitemap.xml from routes + blog posts
 * Run: node scripts/generate-sitemap.mjs
 */

import { readdir, readFile, writeFile } from 'fs/promises';
import { join, resolve } from 'path';

const SITE_URL = 'https://muneer.architect';
const BLOG_DIR = resolve('content/blog');
const OUT_FILE = resolve('public/sitemap.xml');

// Static pages with priorities
const STATIC_PAGES = [
  { path: '/',            changefreq: 'monthly',  priority: 1.0 },
  { path: '/portfolio',   changefreq: 'monthly',  priority: 0.8 },
  { path: '/open-source', changefreq: 'monthly',  priority: 0.7 },
  { path: '/blog',        changefreq: 'weekly',   priority: 0.9 },
];

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function getBlogPosts() {
  const files = await readdir(BLOG_DIR);
  const posts = [];

  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    const raw = await readFile(join(BLOG_DIR, file), 'utf-8');
    const match = raw.match(/^---\n([\s\S]*?)\n---/);
    if (!match) continue;

    const fm = {};
    for (const line of match[1].split('\n')) {
      const idx = line.indexOf(':');
      if (idx === -1) continue;
      fm[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
    }

    if (fm.status === 'draft') continue;

    posts.push({
      path: `/blog/${fm.slug || file.replace('.md', '')}`,
      lastmod: fm.updated || fm.date || null,
      changefreq: 'monthly',
      priority: 0.7,
      ...(fm.coverImage ? { image: fm.coverImage, imageTitle: fm.title, imageAlt: fm.coverAlt } : {}),
    });
  }

  return posts;
}

async function main() {
  const posts = await getBlogPosts();
  const today = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

  // Static pages
  for (const page of STATIC_PAGES) {
    xml += `  <url>
    <loc>${escapeXml(SITE_URL + page.path)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  }

  // Blog posts
  for (const post of posts) {
    xml += `  <url>
    <loc>${escapeXml(SITE_URL + post.path)}</loc>`;
    if (post.lastmod) xml += `\n    <lastmod>${post.lastmod}</lastmod>`;
    xml += `
    <changefreq>${post.changefreq}</changefreq>
    <priority>${post.priority}</priority>`;
    if (post.image) {
      xml += `
    <image:image>
      <image:loc>${escapeXml(post.image)}</image:loc>
      <image:title>${escapeXml(post.imageTitle || '')}</image:title>
      <image:caption>${escapeXml(post.imageAlt || '')}</image:caption>
    </image:image>`;
    }
    xml += `
  </url>
`;
  }

  xml += `</urlset>
`;

  await writeFile(OUT_FILE, xml, 'utf-8');
  console.log(`✓ Sitemap written to ${OUT_FILE} (${STATIC_PAGES.length + posts.length} URLs)`);
}

main().catch(console.error);
