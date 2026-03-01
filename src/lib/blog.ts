/**
 * Blog utilities — loads metadata from pre-built manifest, lazy-loads content on demand
 *
 * Frontmatter Schema:
 * ---
 * title: string              — Post title (also used for og:title)
 * slug: string               — URL slug (must match filename)
 * date: string               — ISO date (YYYY-MM-DD)
 * updated: string?           — Last modified date (YYYY-MM-DD)
 * excerpt: string            — 1-2 sentence summary (also used for meta description)
 * category: string           — Primary category
 * tags: string[]             — Searchable tags
 * readTime: string           — Estimated read time (e.g. "12 min read")
 * status: draft | published
 * coverImage: string?        — Path to cover image (relative to /public or absolute URL)
 * coverAlt: string?          — Alt text for cover image
 * coverCaption: string?      — Optional caption for cover image
 * ogImage: string?           — Custom OG image (defaults to coverImage)
 * author: string?            — Author name (defaults to "Muneer Puthiya Purayil")
 * canonical: string?         — Canonical URL override
 * noindex: boolean?          — Prevent indexing (default false)
 * sources: string[]?         — URLs/references backing claims (required for agentic posts)
 * ---
 */

import manifestData from '../data/blog-manifest.json';

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
}

// Full post = meta + content
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

const SITE_URL = 'https://muneer.architect';
const DEFAULT_AUTHOR = 'Muneer Puthiya Purayil';
const POSTS_PER_PAGE = 12;

// Lazy-loaded post content modules
const postModules = import.meta.glob('/content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: false,
});

function parseFrontmatter(raw: string): { data: Record<string, any>; content: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };

  const frontmatterStr = match[1];
  const content = match[2].trim();
  const data: Record<string, any> = {};

  for (const line of frontmatterStr.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let value: any = line.slice(colonIdx + 1).trim();

    // Handle arrays: [item1, item2]
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map((s: string) => s.trim().replace(/^["']|["']$/g, ''));
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

  return { data, content };
}

// ---------------------------------------------------------------------------
// Core data access
// ---------------------------------------------------------------------------

export function getAllPosts(): BlogPostMeta[] {
  return manifestData as BlogPostMeta[];
}

export function getPostBySlug(slug: string): BlogPostMeta | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export async function getPostContent(slug: string): Promise<string | null> {
  const path = `/content/blog/${slug}.md`;
  const loader = postModules[path];
  if (!loader) return null;
  const raw = (await loader()) as string;
  const { content } = parseFrontmatter(raw);
  return content;
}

export async function getFullPost(slug: string): Promise<BlogPost | null> {
  const meta = getPostBySlug(slug);
  if (!meta) return null;
  const content = await getPostContent(slug);
  if (!content) return null;
  return { ...meta, content };
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

/**
 * Generate SEO metadata for a blog post
 */
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

/**
 * Generate JSON-LD structured data for a blog post (Article schema)
 */
export function getPostJsonLd(post: BlogPost): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: post.title,
    description: post.excerpt,
    image: post.ogImage || post.coverImage || undefined,
    datePublished: post.date,
    dateModified: post.updated || post.date,
    author: {
      '@type': 'Person',
      name: post.author,
      url: SITE_URL,
      jobTitle: 'SaaS Architect & AI Systems Engineer',
    },
    publisher: {
      '@type': 'Person',
      name: DEFAULT_AUTHOR,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.slug}`,
    },
    keywords: post.tags.join(', '),
    articleSection: post.category,
    wordCount: post.content.split(/\s+/).length,
    ...(post.sources && post.sources.length > 0
      ? { citation: post.sources.map((url) => ({ '@type': 'WebPage', url })) }
      : {}),
  };
}

/**
 * Generate JSON-LD for the blog listing page (CollectionPage)
 */
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

/**
 * Generate site-wide JSON-LD (Person + WebSite)
 */
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

/**
 * Generate BreadcrumbList JSON-LD for a blog post
 */
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

/**
 * Generate FAQPage JSON-LD from markdown FAQ section
 * Convention: ## FAQ or ## Frequently Asked Questions section with ### Q: / A: pattern
 */
export function extractFaqJsonLd(content: string): object | null {
  const faqMatch = content.match(/## (?:FAQ|Frequently Asked Questions)\n([\s\S]*?)(?=\n## |\n$)/i);
  if (!faqMatch) return null;

  const faqContent = faqMatch[1];
  const questions: { question: string; answer: string }[] = [];

  // Match ### question patterns followed by answer paragraphs
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
