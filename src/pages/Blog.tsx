import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Clock, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAllPosts, getBlogListJsonLd } from '../lib/blog';
import SEOHead from '../components/SEOHead';

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-4 mb-12">
    <div className="h-[1px] w-12 bg-white/20" />
    <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-white/40">{children}</span>
  </div>
);

const BlogCard = ({ title, excerpt, date, readTime, category, slug, coverImage }: any) => (
  <Link
    to={`/blog/${slug}`}
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

export default function Blog() {
  const posts = getAllPosts();
  const jsonLd = getBlogListJsonLd(posts);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-40 px-6"
    >
      <SEOHead
        title="Technical Journal | Muneer Puthiya Purayil"
        description="Notes on architecture, systems design, and agentic AI. Drawn from production work, not theory."
        jsonLd={jsonLd}
      />

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

        <div className="border-t border-white/10">
          {posts.map((post) => (
            <BlogCard key={post.slug} {...post} />
          ))}
        </div>

        {posts.length === 0 && (
          <div className="mt-24 py-20 text-center">
            <p className="text-white/20 font-mono text-xs uppercase tracking-widest">No published articles yet.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
