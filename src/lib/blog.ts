/**
 * Blog utilities — loads and parses markdown blog posts from /content/blog/
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

export interface BlogPost {
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

// Blog posts are imported at build time via Vite's import.meta.glob
const postFiles = import.meta.glob('/content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
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

export function getAllPosts(): BlogPost[] {
  const posts: BlogPost[] = [];

  for (const [filepath, raw] of Object.entries(postFiles)) {
    const { data, content } = parseFrontmatter(raw as string);

    if (data.status === 'draft') continue;

    posts.push({
      title: data.title || 'Untitled',
      slug: data.slug || filepath.split('/').pop()?.replace('.md', '') || '',
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
      author: data.author || DEFAULT_AUTHOR,
      canonical: data.canonical || undefined,
      noindex: data.noindex === true,
      sources: Array.isArray(data.sources) ? data.sources : undefined,
      content,
    });
  }

  // Sort by date descending
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

/**
 * Generate SEO metadata for a blog post
 */
export function getPostSEO(post: BlogPost): BlogSEO {
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
export function getBlogListJsonLd(posts: BlogPost[]): object {
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
    ],
  };
}

/**
 * Generate BreadcrumbList JSON-LD for a blog post
 */
export function getBreadcrumbJsonLd(post: BlogPost): object {
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
