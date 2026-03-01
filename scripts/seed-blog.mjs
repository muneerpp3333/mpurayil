/**
 * Seed blog posts from content/blog/*.md into Postgres via Prisma
 */

import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import pkg from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const { PrismaClient } = pkg;
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

const PROTECTED_SLUGS = [
  'scaling-to-4b-lessons-in-latency',
  'architecting-for-the-agentic-era',
  'multi-tenant-saas-playbook',
  'react-native-performance-at-enterprise-scale',
];

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };

  const frontmatterStr = match[1];
  const content = match[2].trim();
  const data = {};

  for (const line of frontmatterStr.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();

    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map((s) => s.trim().replace(/^["']|["']$/g, ''));
    } else if (value === 'true') {
      value = true;
    } else if (value === 'false') {
      value = false;
    } else if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    data[key] = value;
  }

  return { data, content };
}

function detectArticleType(slug) {
  if (slug.includes('-guide-') || slug.endsWith('-guide')) return 'guide';
  if (slug.includes('-vs-')) return 'comparison';
  if (slug.includes('-tutorial-') || slug.endsWith('-tutorial')) return 'tutorial';
  if (slug.includes('-best-practices')) return 'best_practices';
  if (slug.includes('-case-study')) return 'case_study';
  return 'original';
}

function detectContentStatus(content, slug) {
  if (PROTECTED_SLUGS.includes(slug)) return 'PUBLISHED';
  if (content.includes('<!-- CONTENT:') || content.includes('// TODO:')) return 'SKELETON';
  return 'GENERATED';
}

async function main() {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));
  console.log(`Found ${files.length} markdown files`);

  let seeded = 0;
  let skeletons = 0;
  let published = 0;
  let generated = 0;

  for (const file of files) {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8');
    const { data, content } = parseFrontmatter(raw);
    const slug = file.replace(/\.md$/, '');
    const contentStatus = detectContentStatus(content, slug);
    const isProtected = PROTECTED_SLUGS.includes(slug);

    if (contentStatus === 'SKELETON') skeletons++;
    else if (contentStatus === 'PUBLISHED') published++;
    else generated++;

    await prisma.blogPost.upsert({
      where: { slug },
      create: {
        slug,
        title: data.title || slug,
        date: String(data.date || ''),
        updated: data.updated ? String(data.updated) : null,
        excerpt: data.excerpt || '',
        category: data.category || '',
        tags: Array.isArray(data.tags) ? data.tags : [],
        readTime: data.readTime || '',
        status: data.status || 'published',
        coverImage: data.coverImage || null,
        coverAlt: data.coverAlt || null,
        coverCaption: data.coverCaption || null,
        ogImage: data.ogImage || data.coverImage || null,
        author: data.author || 'Muneer Puthiya Purayil',
        canonical: data.canonical || null,
        noindex: data.noindex || false,
        sources: Array.isArray(data.sources) ? data.sources.filter((s) => s !== '') : [],
        content,
        contentStatus,
        articleType: detectArticleType(slug),
        isProtected,
      },
      update: {
        title: data.title || slug,
        date: String(data.date || ''),
        updated: data.updated ? String(data.updated) : null,
        excerpt: data.excerpt || '',
        category: data.category || '',
        tags: Array.isArray(data.tags) ? data.tags : [],
        readTime: data.readTime || '',
        status: data.status || 'published',
        coverImage: data.coverImage || null,
        coverAlt: data.coverAlt || null,
        coverCaption: data.coverCaption || null,
        ogImage: data.ogImage || data.coverImage || null,
        author: data.author || 'Muneer Puthiya Purayil',
        canonical: data.canonical || null,
        noindex: data.noindex || false,
        sources: Array.isArray(data.sources) ? data.sources.filter((s) => s !== '') : [],
        content,
        contentStatus,
        articleType: detectArticleType(slug),
        isProtected,
      },
    });

    seeded++;
  }

  console.log(`\nSeeded ${seeded} posts:`);
  console.log(`  SKELETON:  ${skeletons}`);
  console.log(`  GENERATED: ${generated}`);
  console.log(`  PUBLISHED: ${published}`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
