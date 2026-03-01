#!/usr/bin/env node
/**
 * generate-blog-manifest.mjs — extracts frontmatter from blog posts into a JSON manifest
 * Run: node scripts/generate-blog-manifest.mjs
 */

import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { join, resolve } from 'path';

const BLOG_DIR = resolve('content/blog');
const OUT_FILE = resolve('src/data/blog-manifest.json');

async function main() {
  const files = await readdir(BLOG_DIR);
  const posts = [];

  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    const raw = await readFile(join(BLOG_DIR, file), 'utf-8');
    const match = raw.match(/^---\n([\s\S]*?)\n---/);
    if (!match) continue;

    const data = {};
    for (const line of match[1].split('\n')) {
      const idx = line.indexOf(':');
      if (idx === -1) continue;
      const key = line.slice(0, idx).trim();
      let value = line.slice(idx + 1).trim();

      // Handle arrays: [item1, item2]
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
      }
      // Handle booleans
      else if (value === 'true') value = true;
      else if (value === 'false') value = false;
      // Strip quotes
      else if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      data[key] = value;
    }

    if (data.status === 'draft') continue;

    posts.push({
      title: data.title || 'Untitled',
      slug: data.slug || file.replace('.md', ''),
      date: data.date || '',
      updated: data.updated || undefined,
      excerpt: data.excerpt || '',
      category: data.category || '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      readTime: data.readTime || '',
      status: data.status || 'published',
      coverImage: data.coverImage || undefined,
      coverAlt: data.coverAlt || undefined,
      coverCaption: data.coverCaption || undefined,
      ogImage: data.ogImage || data.coverImage || undefined,
      author: data.author || 'Muneer Puthiya Purayil',
      canonical: data.canonical || undefined,
      noindex: data.noindex === true ? true : undefined,
      sources: Array.isArray(data.sources) ? data.sources : undefined,
    });
  }

  // Sort by date descending
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Remove undefined values for cleaner JSON
  const clean = JSON.parse(JSON.stringify(posts));

  await writeFile(OUT_FILE, JSON.stringify(clean, null, 2) + '\n', 'utf-8');
  console.log(`Blog manifest written to ${OUT_FILE} (${clean.length} posts)`);
}

main().catch(console.error);
