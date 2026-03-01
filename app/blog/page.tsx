import type { Metadata } from 'next';
import { getAllPosts, getCategories, getTopTags, getBlogListJsonLd } from '../lib/blog';
import BlogListClient from '../components/blog/BlogListClient';

export const metadata: Metadata = {
  title: 'Technical Journal',
  description: 'Notes on architecture, systems design, and agentic AI. Drawn from production work, not theory.',
  alternates: { canonical: 'https://muneer.architect/blog' },
  openGraph: {
    title: 'Technical Journal',
    description: 'Notes on architecture, systems design, and agentic AI. Drawn from production work, not theory.',
    url: 'https://muneer.architect/blog',
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Technical Journal',
    description: 'Notes on architecture, systems design, and agentic AI. Drawn from production work, not theory.',
    images: ['/og-default.png'],
  },
};

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getCategories();
  const topTags = getTopTags(15);
  const jsonLd = getBlogListJsonLd(posts);
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://muneer.architect' },
      { '@type': 'ListItem', position: 2, name: 'Journal', item: 'https://muneer.architect/blog' },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <BlogListClient posts={posts} categories={categories} topTags={topTags} />
    </>
  );
}
