import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug, getPostSEO, getPostJsonLd, getBreadcrumbJsonLd, extractFaqJsonLd } from '../../lib/blog';
import BlogPostClient from '../../components/blog/BlogPostClient';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const seo = getPostSEO(post);
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: seo.canonical },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `https://muneer.architect/blog/${slug}`,
      siteName: 'Muneer Puthiya Purayil',
      publishedTime: post.date,
      modifiedTime: post.updated || post.date,
      authors: [post.author],
      tags: post.tags,
      images: post.ogImage ? [{ url: post.ogImage }] : [{ url: '/og-default.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.ogImage ? [post.ogImage] : ['/og-default.png'],
    },
    robots: post.noindex ? { index: false } : undefined,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  // JSON-LD
  const jsonLdItems: object[] = [];
  jsonLdItems.push(getPostJsonLd(post));
  jsonLdItems.push(getBreadcrumbJsonLd(post));
  const faqJsonLd = extractFaqJsonLd(post.content);
  if (faqJsonLd) jsonLdItems.push(faqJsonLd);

  // Prev/Next navigation
  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? { slug: allPosts[currentIndex - 1].slug, title: allPosts[currentIndex - 1].title } : null;
  const nextPost = currentIndex >= 0 && currentIndex < allPosts.length - 1 ? { slug: allPosts[currentIndex + 1].slug, title: allPosts[currentIndex + 1].title } : null;

  // Related posts by category + tags (exclude current, max 3)
  const relatedPosts = allPosts
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      ...p,
      score: (p.category === post.category ? 3 : 0) + p.tags.filter((t) => post.tags.includes(t)).length,
    }))
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((p) => ({ slug: p.slug, title: p.title, category: p.category, readTime: p.readTime }));

  return (
    <>
      {jsonLdItems.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <BlogPostClient post={post} prevPost={prevPost} nextPost={nextPost} relatedPosts={relatedPosts} />
    </>
  );
}
