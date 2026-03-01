'use client';

import React, { Suspense, useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Clock, Tag } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { BlogPostMeta } from '@/app/lib/blog';

const POSTS_PER_PAGE = 12;

interface BlogListProps {
  posts: BlogPostMeta[];
  categories: string[];
  topTags: string[];
}

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-4 mb-12">
    <div className="h-[1px] w-12 bg-white/20" />
    <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-white/40">{children}</span>
  </div>
);

const BlogCard = ({ title, excerpt, date, readTime, category, slug, coverImage }: any) => (
  <Link
    href={`/blog/${slug}`}
    className="group cursor-pointer border-b border-white/10 py-16 hover:bg-white/[0.01] transition-colors px-4 -mx-4 block"
  >
    <div className="grid md:grid-cols-[1fr_280px] gap-8 items-start">
      <div>
        <div className="flex items-center gap-6 mb-8 text-[10px] font-mono uppercase tracking-widest text-white/40">
          <span className="flex items-center gap-2"><Clock className="w-3 h-3" /> {readTime}</span>
          <span className="flex items-center gap-2"><Tag className="w-3 h-3" /> {category}</span>
          <span>{new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</span>
        </div>
        <div className="flex items-start justify-between gap-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-medium mb-6 group-hover:translate-x-2 transition-transform duration-300 tracking-tight">{title}</h2>
            <p className="text-white/50 leading-relaxed max-w-2xl">{excerpt}</p>
          </div>
          <ArrowUpRight className="w-6 h-6 text-white/20 group-hover:text-white/60 transition-colors flex-shrink-0 mt-2 md:hidden" />
        </div>
      </div>
      {coverImage && (
        <div className="hidden md:block overflow-hidden border border-white/10 aspect-[16/10]">
          <img
            src={coverImage}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover grayscale brightness-75 group-hover:brightness-100 group-hover:grayscale-0 transition-all duration-700"
          />
        </div>
      )}
    </div>
  </Link>
);

function buildSearchParams(params: Record<string, string | number | undefined>): string {
  const sp = new URLSearchParams();
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== '') sp.set(key, String(val));
  }
  const str = sp.toString();
  return str ? `?${str}` : '';
}

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | 'ellipsis')[] = [1];

  if (current > 3) pages.push('ellipsis');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push('ellipsis');

  pages.push(total);
  return pages;
}

function BlogInner({ posts, categories, topTags }: BlogListProps) {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const activeCategory = searchParams.get('category') || '';
  const activeTag = searchParams.get('tag') || '';

  const { filteredPosts, totalPages, currentPage, totalPosts } = useMemo(() => {
    let filtered = posts;
    if (activeCategory) filtered = filtered.filter((p) => p.category === activeCategory);
    if (activeTag) filtered = filtered.filter((p) => p.tags.includes(activeTag));
    const total = filtered.length;
    const tp = Math.ceil(total / POSTS_PER_PAGE);
    const cp = Math.min(Math.max(1, page), tp || 1);
    const start = (cp - 1) * POSTS_PER_PAGE;
    return {
      filteredPosts: filtered.slice(start, start + POSTS_PER_PAGE),
      totalPages: tp,
      currentPage: cp,
      totalPosts: total,
    };
  }, [posts, page, activeCategory, activeTag]);

  const pageNumbers = useMemo(() => getPageNumbers(currentPage, totalPages), [currentPage, totalPages]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-40 px-6"
    >
      <div className="max-w-[1400px] mx-auto">
        <header className="mb-32">
          <SectionLabel>Insights</SectionLabel>
          <h1 className="text-[clamp(2.5rem,8vw,6rem)] font-medium leading-none tracking-tighter mb-12">
            Technical<br />Journal.
          </h1>
          <p className="text-xl text-white/40 max-w-2xl leading-relaxed">
            Notes on architecture, systems design, and agentic AI. Drawn from production work, not theory.
          </p>
        </header>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Link
            href={buildSearchParams({})}
            className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest border transition-colors ${
              !activeCategory
                ? 'bg-white text-black border-white'
                : 'bg-transparent text-white/40 border-white/10 hover:border-white/20'
            }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={buildSearchParams({ category: cat, tag: activeTag || undefined })}
              className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest border transition-colors ${
                activeCategory === cat
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent text-white/40 border-white/10 hover:border-white/20'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Tag filter */}
        {topTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-12">
            {topTags.map((tag) => (
              <Link
                key={tag}
                href={buildSearchParams({
                  tag: activeTag === tag ? undefined : tag,
                  category: activeCategory || undefined,
                })}
                className={`px-2.5 py-1 text-[9px] font-mono uppercase tracking-widest border transition-colors ${
                  activeTag === tag
                    ? 'bg-white text-black border-white'
                    : 'bg-transparent text-white/30 border-white/5 hover:border-white/15'
                }`}
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        {/* Post count */}
        <div className="flex items-center justify-between mb-2 text-[10px] font-mono uppercase tracking-widest text-white/30">
          <span>{totalPosts} article{totalPosts !== 1 ? 's' : ''}</span>
          {totalPages > 1 && <span>Page {currentPage} of {totalPages}</span>}
        </div>

        {/* Posts */}
        <div className="border-t border-white/10">
          {filteredPosts.map((post) => (
            <BlogCard key={post.slug} {...post} />
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="mt-24 py-20 text-center">
            <p className="text-white/20 font-mono text-xs uppercase tracking-widest">No published articles yet.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="flex items-center justify-center gap-1 mt-16 mb-8">
            {currentPage > 1 ? (
              <Link
                href={`/blog${buildSearchParams({
                  page: currentPage - 1 > 1 ? currentPage - 1 : undefined,
                  category: activeCategory || undefined,
                  tag: activeTag || undefined,
                })}`}
                className="px-3 py-2 text-[11px] font-mono uppercase tracking-widest text-white/40 hover:text-white/60 transition-colors"
              >
                Prev
              </Link>
            ) : (
              <span className="px-3 py-2 text-[11px] font-mono uppercase tracking-widest text-white/10">Prev</span>
            )}

            {pageNumbers.map((p, i) =>
              p === 'ellipsis' ? (
                <span key={`e${i}`} className="px-2 py-2 text-[11px] font-mono text-white/20">...</span>
              ) : (
                <Link
                  key={p}
                  href={`/blog${buildSearchParams({
                    page: p > 1 ? p : undefined,
                    category: activeCategory || undefined,
                    tag: activeTag || undefined,
                  })}`}
                  className={`px-3 py-2 text-[11px] font-mono transition-colors ${
                    p === currentPage
                      ? 'text-white border-b-2 border-white'
                      : 'text-white/40 hover:text-white/60'
                  }`}
                >
                  {p}
                </Link>
              ),
            )}

            {currentPage < totalPages ? (
              <Link
                href={`/blog${buildSearchParams({
                  page: currentPage + 1,
                  category: activeCategory || undefined,
                  tag: activeTag || undefined,
                })}`}
                className="px-3 py-2 text-[11px] font-mono uppercase tracking-widest text-white/40 hover:text-white/60 transition-colors"
              >
                Next
              </Link>
            ) : (
              <span className="px-3 py-2 text-[11px] font-mono uppercase tracking-widest text-white/10">Next</span>
            )}
          </nav>
        )}
      </div>
    </motion.div>
  );
}

export default function BlogListClient(props: BlogListProps) {
  return (
    <Suspense fallback={<div className="pt-40 px-6 min-h-screen" />}>
      <BlogInner {...props} />
    </Suspense>
  );
}
