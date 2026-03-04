/**
 * Blog utilities — Postgres-backed via Prisma
 * Reads all posts from DB at module init (preserves sync API for static export)
 */

import { prisma } from './db';

export interface BlogPostMeta {
  title: string;
  slug: string;
  date: string;
  updated?: string;
  excerpt: string;
  category: string;
  tags: string[];
  readTime: string;
  status: 'draft' | 'published';
  coverImage?: string;
  coverAlt?: string;
  coverCaption?: string;
  ogImage?: string;
  author: string;
  canonical?: string;
  noindex?: boolean;
  sources?: string[];
  articleType?: string;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}

export interface BlogSEO {
  title: string;
  description: string;
  canonical: string;
  ogType: 'article' | 'website';
  ogImage?: string;
  ogImageAlt?: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  tags: string[];
  category: string;
  noindex: boolean;
}

const SITE_URL = 'https://mpurayil.com';
const DEFAULT_AUTHOR = 'Muneer Puthiya Purayil';
const POSTS_PER_PAGE = 12;

// ---------------------------------------------------------------------------
// Module-level cache (populated once via top-level await)
// ---------------------------------------------------------------------------

let _postsCache: BlogPostMeta[] = [];
let _fullPostsCache: Map<string, BlogPost> = new Map();

function dbRowToMeta(row: any): BlogPostMeta {
  return {
    title: row.title,
    slug: row.slug,
    date: row.date,
    updated: row.updated || undefined,
    excerpt: row.excerpt,
    category: row.category,
    tags: row.tags || [],
    readTime: row.readTime,
    status: row.status as 'draft' | 'published',
    coverImage: row.coverImage || undefined,
    coverAlt: row.coverAlt || undefined,
    coverCaption: row.coverCaption || undefined,
    ogImage: row.ogImage || row.coverImage || undefined,
    author: row.author || DEFAULT_AUTHOR,
    canonical: row.canonical || undefined,
    noindex: row.noindex || false,
    sources: row.sources?.length ? row.sources.filter((s: string) => s !== '') : undefined,
    articleType: row.articleType || undefined,
  };
}

// Top-level await: loads all posts from DB once at build time
// Only show posts with real content (GENERATED, REVIEWED, PUBLISHED)
const rows = await prisma.blogPost.findMany({
  where: {
    status: 'published',
    contentStatus: { in: ['GENERATED', 'REVIEWED', 'PUBLISHED'] },
  },
  orderBy: { date: 'desc' },
});

for (const row of rows) {
  const meta = dbRowToMeta(row);
  _postsCache.push(meta);
  _fullPostsCache.set(row.slug, { ...meta, content: row.content });
}

// ---------------------------------------------------------------------------
// Core data access
// ---------------------------------------------------------------------------

export function getAllPosts(): BlogPostMeta[] {
  return _postsCache;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return _fullPostsCache.get(slug);
}

// ---------------------------------------------------------------------------
// Pagination & filtering helpers
// ---------------------------------------------------------------------------

export function getPaginatedPosts(
  page: number,
  category?: string,
  tag?: string,
): {
  posts: BlogPostMeta[];
  totalPages: number;
  currentPage: number;
  totalPosts: number;
} {
  let filtered = getAllPosts();
  if (category) filtered = filtered.filter((p) => p.category === category);
  if (tag) filtered = filtered.filter((p) => p.tags.includes(tag));
  const totalPosts = filtered.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const currentPage = Math.min(Math.max(1, page), totalPages || 1);
  const start = (currentPage - 1) * POSTS_PER_PAGE;
  return {
    posts: filtered.slice(start, start + POSTS_PER_PAGE),
    totalPages,
    currentPage,
    totalPosts,
  };
}

export function getCategories(): string[] {
  const cats = new Set(getAllPosts().map((p) => p.category));
  return Array.from(cats).sort();
}

export function getTopTags(limit = 20): string[] {
  const tagCount = new Map<string, number>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
    }
  }
  return Array.from(tagCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag]) => tag);
}

export function getPostsByCategory(category: string): BlogPostMeta[] {
  return getAllPosts().filter((p) => p.category === category);
}

export function getPostsByTag(tag: string): BlogPostMeta[] {
  return getAllPosts().filter((p) => p.tags.includes(tag));
}

// ---------------------------------------------------------------------------
// SEO & structured data
// ---------------------------------------------------------------------------

export function getPostSEO(post: BlogPostMeta | BlogPost): BlogSEO {
  return {
    title: `${post.title} — Muneer Puthiya Purayil`,
    description: post.excerpt,
    canonical: post.canonical || `${SITE_URL}/blog/${post.slug}`,
    ogType: 'article',
    ogImage: post.ogImage,
    ogImageAlt: post.coverAlt || post.title,
    author: post.author,
    datePublished: post.date,
    dateModified: post.updated || post.date,
    tags: post.tags,
    category: post.category,
    noindex: post.noindex || false,
  };
}

// Map categories to Schema.org Thing entities for `about`
const CATEGORY_ENTITIES: Record<string, { '@type': string; name: string; url?: string }[]> = {
  'AI Architecture': [
    { '@type': 'Thing', name: 'Artificial Intelligence', url: 'https://en.wikipedia.org/wiki/Artificial_intelligence' },
    { '@type': 'Thing', name: 'Software Architecture', url: 'https://en.wikipedia.org/wiki/Software_architecture' },
  ],
  'SaaS Architecture': [
    { '@type': 'Thing', name: 'Software as a Service', url: 'https://en.wikipedia.org/wiki/Software_as_a_service' },
    { '@type': 'Thing', name: 'Software Architecture', url: 'https://en.wikipedia.org/wiki/Software_architecture' },
  ],
  'SaaS Engineering': [
    { '@type': 'Thing', name: 'Software as a Service', url: 'https://en.wikipedia.org/wiki/Software_as_a_service' },
    { '@type': 'Thing', name: 'Software Engineering', url: 'https://en.wikipedia.org/wiki/Software_engineering' },
  ],
  'System Design': [
    { '@type': 'Thing', name: 'Systems Design', url: 'https://en.wikipedia.org/wiki/Systems_design' },
  ],
  'DevOps': [
    { '@type': 'Thing', name: 'DevOps', url: 'https://en.wikipedia.org/wiki/DevOps' },
  ],
  'Scalability': [
    { '@type': 'Thing', name: 'Scalability', url: 'https://en.wikipedia.org/wiki/Scalability' },
  ],
  'Mobile Engineering': [
    { '@type': 'Thing', name: 'Mobile Application Development', url: 'https://en.wikipedia.org/wiki/Mobile_app_development' },
  ],
  'Mobile/Frontend': [
    { '@type': 'Thing', name: 'Mobile Application Development', url: 'https://en.wikipedia.org/wiki/Mobile_app_development' },
    { '@type': 'Thing', name: 'Front-end Web Development', url: 'https://en.wikipedia.org/wiki/Front-end_web_development' },
  ],
};

// Map articleType to Schema.org proficiencyLevel
function getProficiencyLevel(articleType?: string): string {
  switch (articleType) {
    case 'tutorial': return 'Beginner';
    case 'guide': return 'Intermediate';
    case 'best_practices':
    case 'case_study':
    case 'original': return 'Expert';
    case 'comparison': return 'Intermediate';
    default: return 'Intermediate';
  }
}

// Convert readTime string ("8 min read") to ISO 8601 duration
function readTimeToIsoDuration(readTime: string): string {
  const match = readTime.match(/(\d+)/);
  const minutes = match ? parseInt(match[1], 10) : 5;
  return `PT${minutes}M`;
}

export function getPostJsonLd(post: BlogPost): object {
  const wordCount = post.content.split(/\s+/).length;
  const aboutEntities = CATEGORY_ENTITIES[post.category] || [];

  // Build tag-based `mentions` entities
  const mentions = post.tags.slice(0, 5).map((tag) => ({
    '@type': 'Thing',
    name: tag,
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: post.title,
    description: post.excerpt,
    image: post.ogImage || post.coverImage || `${SITE_URL}/og-default.png`,
    datePublished: `${post.date}T00:00:00Z`,
    dateModified: `${post.updated || post.date}T00:00:00Z`,
    author: {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: post.author,
      url: SITE_URL,
      jobTitle: 'SaaS Architect & AI Systems Engineer',
    },
    publisher: {
      '@type': 'Organization',
      name: DEFAULT_AUTHOR,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/apple-touch-icon.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.slug}`,
    },
    inLanguage: 'en-US',
    keywords: post.tags.join(', '),
    articleSection: post.category,
    wordCount,
    timeRequired: readTimeToIsoDuration(post.readTime),
    proficiencyLevel: getProficiencyLevel(post.articleType),
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['article h1', 'article .excerpt', 'article h2'],
    },
    ...(aboutEntities.length > 0 ? { about: aboutEntities } : {}),
    ...(mentions.length > 0 ? { mentions } : {}),
    ...(post.sources && post.sources.length > 0
      ? { citation: post.sources.map((url) => ({ '@type': 'WebPage', url })) }
      : {}),
  };
}

export function getBlogListJsonLd(posts: BlogPostMeta[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Technical Journal — Muneer Puthiya Purayil',
    description: 'Notes on architecture, systems design, and agentic AI — drawn from production work, not theory.',
    url: `${SITE_URL}/blog`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.map((post, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE_URL}/blog/${post.slug}`,
        name: post.title,
      })),
    },
  };
}

export function getSiteJsonLd(): object {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/#person`,
        name: DEFAULT_AUTHOR,
        url: SITE_URL,
        jobTitle: 'SaaS Architect & AI Systems Engineer',
        description: '10+ years shipping production infrastructure — from $4B automotive platforms to sub-0.1% crash-rate banking systems. Specializing in SaaS architecture, agentic AI systems, and enterprise mobile.',
        knowsAbout: [
          'Software Architecture',
          'Agentic AI',
          'SaaS Platforms',
          'React Native',
          'Microservices',
          'Multi-Tenant Architecture',
          'Cloud Infrastructure',
          'CI/CD Pipelines',
          'Performance Engineering',
          'TypeScript',
          'Node.js',
          'React',
          'Kubernetes',
        ],
        hasOccupation: {
          '@type': 'Occupation',
          name: 'SaaS Architect',
          occupationalCategory: '15-1252.00',
          skills: 'Software Architecture, System Design, Cloud Infrastructure, AI/ML Integration',
        },
        alumniOf: {
          '@type': 'EducationalOrganization',
          name: 'Calicut University',
        },
        sameAs: [
          'https://linkedin.com/in/muneer-p-5052b6128',
          'https://github.com/muneerpp3333',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'Muneer Puthiya Purayil',
        description: 'Scalable Architecture. Agentic AI. Uncompromising Execution.',
        publisher: { '@id': `${SITE_URL}/#person` },
        inLanguage: 'en-US',
      },
      {
        '@type': 'ProfessionalService',
        '@id': `${SITE_URL}/#business`,
        name: 'Muneer Puthiya Purayil — Architecture & Engineering',
        url: SITE_URL,
        description: 'SaaS architecture, agentic AI systems, and production-grade website templates. Based in Dubai, serving clients globally.',
        founder: { '@id': `${SITE_URL}/#person` },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Dubai',
          addressCountry: 'AE',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 25.2048,
          longitude: 55.2708,
        },
        areaServed: [
          { '@type': 'Country', name: 'United Arab Emirates' },
          { '@type': 'Country', name: 'India' },
          { '@type': 'Place', name: 'Worldwide (Remote)' },
        ],
        serviceType: [
          'SaaS Architecture',
          'Agentic AI Systems',
          'Website Templates',
          'Mobile App Development',
        ],
        priceRange: '$$',
        sameAs: [
          'https://linkedin.com/in/muneer-p-5052b6128',
          'https://github.com/muneerpp3333',
        ],
      },
    ],
  };
}

export function getBreadcrumbJsonLd(post: BlogPostMeta | BlogPost): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Journal',
        item: `${SITE_URL}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `${SITE_URL}/blog/${post.slug}`,
      },
    ],
  };
}

export function extractHowToJsonLd(post: BlogPost): object | null {
  if (post.articleType !== 'tutorial') return null;

  // Extract H2 sections as steps (skip intro, conclusion, FAQ, Related Reading)
  const skipHeadings = /^(introduction|conclusion|faq|frequently asked questions|related reading|sources|references)$/i;
  const stepMatches = [...post.content.matchAll(/^## (.+)$/gm)];
  const steps: { name: string; text: string }[] = [];

  for (let i = 0; i < stepMatches.length; i++) {
    const heading = stepMatches[i][1].trim();
    if (skipHeadings.test(heading)) continue;

    const startIdx = stepMatches[i].index! + stepMatches[i][0].length;
    const endIdx = i + 1 < stepMatches.length ? stepMatches[i + 1].index! : post.content.length;
    const sectionContent = post.content.slice(startIdx, endIdx).trim();
    // Take first paragraph as step description (max 300 chars)
    const firstPara = sectionContent.split(/\n\n/)[0]?.replace(/[#*_`]/g, '').trim().slice(0, 300);
    if (heading && firstPara) {
      steps.push({ name: heading, text: firstPara });
    }
  }

  if (steps.length < 2) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: post.title,
    description: post.excerpt,
    totalTime: readTimeToIsoDuration(post.readTime),
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

export function extractFaqJsonLd(content: string): object | null {
  const faqMatch = content.match(/## (?:FAQ|Frequently Asked Questions)\n([\s\S]*?)(?=\n## |\n$)/i);
  if (!faqMatch) return null;

  const faqContent = faqMatch[1];
  const questions: { question: string; answer: string }[] = [];

  const qMatches = faqContent.matchAll(/### (.+?)\n\n([\s\S]*?)(?=\n### |\n$)/g);
  for (const m of qMatches) {
    const question = m[1].replace(/^\*\*|\*\*$/g, '').trim();
    const answer = m[2].trim().replace(/\n+/g, ' ').slice(0, 500);
    if (question && answer) {
      questions.push({ question, answer });
    }
  }

  if (questions.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };
}
