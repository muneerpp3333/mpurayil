import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Clock, Calendar, User, List, Copy, Check, Maximize2, X, FileCode } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import bash from 'highlight.js/lib/languages/bash';
import yaml from 'highlight.js/lib/languages/yaml';
import json from 'highlight.js/lib/languages/json';
import cpp from 'highlight.js/lib/languages/cpp';
import python from 'highlight.js/lib/languages/python';
import sql from 'highlight.js/lib/languages/sql';
import go from 'highlight.js/lib/languages/go';
import rust from 'highlight.js/lib/languages/rust';
import diff from 'highlight.js/lib/languages/diff';
import type { BlogPost as BlogPostType } from '../lib/blog';
import { getFullPost, getAllPosts, getPostBySlug, getPostSEO, getPostJsonLd, getBreadcrumbJsonLd, extractFaqJsonLd } from '../lib/blog';
import SEOHead from '../components/SEOHead';

/* ─── Register highlight.js languages ─── */
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('jsx', javascript);
hljs.registerLanguage('tsx', typescript);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('sh', bash);
hljs.registerLanguage('shell', bash);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('yml', yaml);
hljs.registerLanguage('json', json);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('c', cpp);
hljs.registerLanguage('python', python);
hljs.registerLanguage('py', python);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('go', go);
hljs.registerLanguage('rust', rust);
hljs.registerLanguage('rs', rust);
hljs.registerLanguage('diff', diff);

/* ─── TOC types ─── */
interface TocItem {
  id: string;
  text: string;
  level: number;
}

function extractToc(markdown: string): TocItem[] {
  const items: TocItem[] = [];
  const lines = markdown.split('\n');
  let inCodeBlock = false;

  for (const line of lines) {
    if (line.trim().startsWith('```')) { inCodeBlock = !inCodeBlock; continue; }
    if (inCodeBlock) continue;

    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const text = match[2].replace(/\*\*/g, '').replace(/`/g, '').trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      items.push({ id, text, level: match[1].length });
    }
  }
  return items;
}

/* ─── Sidebar TOC (desktop: sticky, mobile: collapsible) ─── */
function SidebarTOC({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-100px 0px -65% 0px', threshold: 0 }
    );

    // Small delay to let headings render with IDs
    const timer = setTimeout(() => {
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el) observer.observe(el);
      }
    }, 100);

    return () => { clearTimeout(timer); observer.disconnect(); };
  }, [items]);

  if (items.length < 2) return null;

  const tocList = (
    <ol className="space-y-0">
      {items.map((item) => (
        <li key={item.id} className="list-none">
          <a
            href={`#${item.id}`}
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById(item.id);
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              setMobileOpen(false);
            }}
            className={`
              block py-1.5 text-[12px] leading-snug transition-colors duration-200 border-l-2
              ${item.level === 3 ? 'pl-5' : 'pl-4'}
              ${activeId === item.id
                ? 'text-white border-white'
                : 'text-white/30 border-transparent hover:text-white/60 hover:border-white/20'
              }
            `}
          >
            {item.text}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      {/* Desktop: sticky sidebar */}
      <aside className="hidden xl:block" aria-label="Table of contents">
        <div className="sticky top-32">
          <p className="text-[10px] uppercase tracking-widest font-mono text-white/25 mb-5">
            On this page
          </p>
          {tocList}
        </div>
      </aside>

      {/* Mobile: collapsible inline */}
      <div className="xl:hidden mb-12">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-mono text-white/40 hover:text-white/60 transition-colors w-full py-4 border-y border-white/10"
        >
          <List className="w-3.5 h-3.5" />
          <span>On this page</span>
          <span className="ml-auto text-white/20">{mobileOpen ? '−' : '+'}</span>
        </button>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-4 border-b border-white/10"
          >
            {tocList}
          </motion.div>
        )}
      </div>
    </>
  );
}

/* ─── Inline image with caption, sizing & lightbox ─── */
/*
  Markdown convention:
    ![alt text](src)                     — full width, no caption
    ![alt text | caption](src)           — full width + caption
    ![alt text | caption | half](src)    — half width + caption
    ![alt text | caption | sm](src)      — small inline (300px)
    ![alt text | | half-right](src)      — half width, float right, no caption
  Size keywords: full (default), half, sm, half-left, half-right
*/
function MarkdownImage({ src, alt }: { src?: string; alt?: string }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const parts = (alt || '').split('|').map((s) => s.trim());
  const altText = parts[0] || '';
  const caption = parts[1] || '';
  const sizeHint = (parts[2] || 'full').toLowerCase();

  const sizeClasses: Record<string, string> = {
    full: 'w-full max-w-full',
    half: 'w-full md:w-1/2 md:mx-auto',
    sm: 'w-full max-w-[300px] mx-auto',
    'half-left': 'w-full md:w-1/2 md:float-left md:mr-6 md:mb-2',
    'half-right': 'w-full md:w-1/2 md:float-right md:ml-6 md:mb-2',
  };

  const wrapperClass = sizeClasses[sizeHint] || sizeClasses.full;

  return (
    <>
      <figure className={`my-8 block w-full ${wrapperClass}`} style={{ display: 'block', width: '100%' }}>
        <div className="overflow-hidden border border-white/10 relative group cursor-pointer w-full" onClick={() => setLightboxOpen(true)}>
          <img
            src={src}
            alt={altText}
            loading="lazy"
            className="block w-full h-auto max-w-full"
            style={{ display: 'block', width: '100%' }}
          />
          {/* Expand icon on hover */}
          <div className="absolute top-3 right-3 p-1.5 bg-black/60 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
            <Maximize2 className="w-3 h-3 text-white/60" />
          </div>
        </div>
        {caption && (
          <figcaption className="mt-3 text-[11px] font-mono text-white/30 uppercase tracking-wider">
            {caption}
          </figcaption>
        )}
      </figure>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-6 cursor-pointer"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 p-2 text-white/50 hover:text-white transition-colors"
              aria-label="Close lightbox"
            >
              <X className="w-5 h-5" />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={src}
              alt={altText}
              className="max-w-full max-h-[85vh] object-contain border border-white/10"
              onClick={(e) => e.stopPropagation()}
            />
            {caption && (
              <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[11px] font-mono text-white/40 uppercase tracking-wider">
                {caption}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Code block with syntax highlighting, copy, language label ─── */
function CodeBlock({ children, className }: { children?: React.ReactNode; className?: string }) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const lang = className?.replace('language-', '') || '';

  const rawCode = typeof children === 'string'
    ? children
    : String(children || '').replace(/\n$/, '');

  // Syntax-highlight with hljs
  const highlightedHtml = useMemo(() => {
    try {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(rawCode, { language: lang }).value;
      }
      return hljs.highlightAuto(rawCode).value;
    } catch {
      return rawCode.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
  }, [rawCode, lang]);

  // Split highlighted HTML into lines
  const highlightedLines = useMemo(() => highlightedHtml.split('\n'), [highlightedHtml]);
  const showLineNumbers = highlightedLines.length > 3;

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(rawCode).then(() => {
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    });
  }, [rawCode]);

  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

  return (
    <div className="relative group my-8 border border-white/10 bg-[#0a0a0a]">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-white/[0.03]">
        <div className="flex items-center gap-2">
          <FileCode className="w-3 h-3 text-white/20" />
          {lang && (
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">
              {lang}
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-mono uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-green-400" />
              <span className="text-green-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code body */}
      <div className="overflow-x-auto">
        <div className="py-4 text-[0.85rem] leading-[1.65] font-mono">
          {showLineNumbers ? (
            highlightedLines.map((line, i) => (
              <div key={i} className="flex hover:bg-white/[0.03] px-4 min-h-[1.65em]">
                <span className="select-none text-right text-white/15 text-[0.75rem] w-8 shrink-0 pr-4 leading-[1.65]">
                  {i + 1}
                </span>
                <span
                  className="whitespace-pre flex-1 hljs-line"
                  dangerouslySetInnerHTML={{ __html: line || '&nbsp;' }}
                />
              </div>
            ))
          ) : (
            <span
              className="px-5 block hljs-line"
              dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Inline code (not code blocks) ─── */
function InlineCode({ children }: { children?: React.ReactNode }) {
  return (
    <code className="text-white/80 bg-white/[0.06] px-1.5 py-0.5 text-[0.9em] font-mono rounded border border-white/5">
      {children}
    </code>
  );
}

/* ─── Custom heading renderer that adds id for TOC anchors ─── */
function HeadingRenderer({ level, children }: { level: number; children: React.ReactNode }) {
  const text = typeof children === 'string'
    ? children
    : Array.isArray(children)
      ? children.map((c: any) => (typeof c === 'string' ? c : c?.props?.children || '')).join('')
      : '';

  const id = text
    .toLowerCase()
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return <Tag id={id}>{children}</Tag>;
}

/* ─── Prose styles ─── */
const PROSE_CLASSES = `
  max-w-none
  [&_h2]:text-[1.75rem] [&_h2]:font-medium [&_h2]:tracking-tight [&_h2]:mt-20 [&_h2]:mb-6 [&_h2]:text-white [&_h2]:scroll-mt-28
  [&_h3]:text-xl [&_h3]:font-medium [&_h3]:mt-14 [&_h3]:mb-4 [&_h3]:text-white/90 [&_h3]:scroll-mt-28
  [&_h4]:text-base [&_h4]:font-medium [&_h4]:mt-10 [&_h4]:mb-3 [&_h4]:text-white/80 [&_h4]:uppercase [&_h4]:tracking-wider [&_h4]:text-sm
  [&_p]:text-white/60 [&_p]:leading-[1.85] [&_p]:mb-6 [&_p]:text-[1.05rem]
  [&_strong]:text-white [&_strong]:font-medium
  [&_em]:text-white/50 [&_em]:italic
  [&_ul]:text-white/60 [&_ul]:leading-[1.85] [&_ul]:mb-6 [&_ul]:pl-6 [&_ul]:list-disc
  [&_ol]:text-white/60 [&_ol]:leading-[1.85] [&_ol]:mb-6 [&_ol]:pl-6 [&_ol]:list-decimal
  [&_li]:mb-3 [&_li]:text-[1.05rem]
  [&_li_p]:mb-2
  [&_blockquote]:border-l-2 [&_blockquote]:border-white/20 [&_blockquote]:pl-6 [&_blockquote]:my-10 [&_blockquote]:py-1
  [&_blockquote_p]:text-white/40 [&_blockquote_p]:text-lg [&_blockquote_p]:italic [&_blockquote_p]:leading-[1.8]
  [&_a]:text-white [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-white/20 hover:[&_a]:decoration-white/60 [&_a]:transition-colors
  [&_hr]:border-white/10 [&_hr]:my-16
  [&_table]:w-full [&_table]:border-collapse [&_table]:mb-8 [&_table]:text-sm
  [&_th]:text-left [&_th]:text-[10px] [&_th]:uppercase [&_th]:tracking-widest [&_th]:font-mono [&_th]:text-white/40 [&_th]:border-b [&_th]:border-white/10 [&_th]:pb-3 [&_th]:pr-6
  [&_td]:text-white/60 [&_td]:border-b [&_td]:border-white/5 [&_td]:py-3 [&_td]:pr-6
  [&_figure]:w-full [&_figure]:max-w-full [&_figure]:block
  [&_figure_img]:w-full [&_figure_img]:max-w-full [&_figure_img]:block [&_figure_img]:h-auto
  [&_.clearfix]:after:content-[''] [&_.clearfix]:after:table [&_.clearfix]:after:clear-both
`;

/* ─── Loading skeleton ─── */
function ContentSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-4 bg-white/5 rounded w-full" />
      <div className="h-4 bg-white/5 rounded w-11/12" />
      <div className="h-4 bg-white/5 rounded w-4/5" />
      <div className="h-8 bg-white/5 rounded w-3/5 mt-12" />
      <div className="h-4 bg-white/5 rounded w-full" />
      <div className="h-4 bg-white/5 rounded w-10/12" />
      <div className="h-4 bg-white/5 rounded w-full" />
      <div className="h-4 bg-white/5 rounded w-9/12" />
      <div className="h-8 bg-white/5 rounded w-2/5 mt-12" />
      <div className="h-4 bg-white/5 rounded w-full" />
      <div className="h-4 bg-white/5 rounded w-4/5" />
      <div className="h-4 bg-white/5 rounded w-full" />
    </div>
  );
}

/* ─── Main component ─── */
export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

  // Immediate meta lookup (sync, no content)
  const meta = slug ? getPostBySlug(slug) : undefined;

  useEffect(() => {
    if (!slug) { setLoading(false); return; }
    setLoading(true);
    setPost(null);
    getFullPost(slug).then((p) => {
      setPost(p);
      setLoading(false);
    });
  }, [slug]);

  // 404: no meta means slug doesn't exist at all
  if (!meta) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="pt-40 px-6 min-h-screen"
      >
        <SEOHead title="Post Not Found" />
        <div className="max-w-[800px] mx-auto text-center">
          <h1 className="text-4xl font-medium mb-8">Post Not Found</h1>
          <Link to="/blog" className="text-white/40 hover:text-white transition-colors font-mono text-sm uppercase tracking-widest">
            &larr; Back to Journal
          </Link>
        </div>
      </motion.div>
    );
  }

  // SEO from meta (available immediately)
  const seo = getPostSEO(meta);
  const breadcrumbJsonLd = getBreadcrumbJsonLd(meta);

  // Full JSON-LD only after content loads
  const jsonLd = useMemo(() => {
    const items: object[] = [breadcrumbJsonLd];
    if (post) {
      items.unshift(getPostJsonLd(post));
      const faqJsonLd = extractFaqJsonLd(post.content);
      if (faqJsonLd) items.push(faqJsonLd);
    }
    return items;
  }, [post, breadcrumbJsonLd]);

  const toc = useMemo(() => post ? extractToc(post.content) : [], [post]);
  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const nextPost = currentIndex >= 0 && currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : undefined;
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : undefined;

  const formattedDate = new Date(meta.date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const hasToc = toc.length >= 2;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-40 px-6 pb-32"
    >
      <SEOHead seo={seo} jsonLd={jsonLd} />

      {/* ═══ Full-width header area ═══ */}
      <header className="max-w-[800px] mx-auto mb-16">
        {/* Back link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-mono text-white/40 hover:text-white transition-colors mb-16"
        >
          <ArrowLeft className="w-3 h-3" /> Back to Journal
        </Link>

        {/* Category */}
        <div className="mb-6">
          <span className="px-3 py-1 bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-widest text-white/50">
            {meta.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-medium leading-[1.1] tracking-tight mb-8">
          {meta.title}
        </h1>

        {/* Excerpt */}
        <p className="text-xl text-white/50 leading-relaxed mb-10 max-w-2xl">
          {meta.excerpt}
        </p>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-6 text-[11px] font-mono text-white/40 border-y border-white/10 py-5">
          <span className="flex items-center gap-2">
            <User className="w-3 h-3" />
            {meta.author}
          </span>
          <span className="flex items-center gap-2">
            <Calendar className="w-3 h-3" />
            <time dateTime={meta.date}>{formattedDate}</time>
          </span>
          <span className="flex items-center gap-2">
            <Clock className="w-3 h-3" /> {meta.readTime}
          </span>
          {meta.updated && meta.updated !== meta.date && (
            <span className="text-white/25">
              Updated: <time dateTime={meta.updated}>
                {new Date(meta.updated).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </time>
            </span>
          )}
        </div>
      </header>

      {/* ═══ Cover image — full article width ═══ */}
      {meta.coverImage && (
        <figure className="max-w-[800px] mx-auto mb-16">
          <div className="overflow-hidden border border-white/10">
            <img
              src={meta.coverImage}
              alt={meta.coverAlt || meta.title}
              className="w-full h-auto"
            />
          </div>
          {meta.coverCaption && (
            <figcaption className="mt-3 text-[11px] font-mono text-white/30 uppercase tracking-wider">
              {meta.coverCaption}
            </figcaption>
          )}
        </figure>
      )}

      {/* ═══ Two-column layout: sidebar TOC + content ═══ */}
      <div className={`max-w-[1200px] mx-auto ${hasToc ? 'xl:grid xl:grid-cols-[200px_1fr] xl:gap-16' : ''}`}>

        {/* Sidebar TOC */}
        {hasToc && <SidebarTOC items={toc} />}

        {/* Article body */}
        <article className="max-w-[800px]" itemScope itemType="https://schema.org/TechArticle">

          {/* Mobile TOC (shows only < xl) — rendered inside SidebarTOC component */}

          {/* Content */}
          {loading ? (
            <ContentSkeleton />
          ) : post ? (
            <div className={PROSE_CLASSES} itemProp="articleBody">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  img: ({ node, ...props }) => <MarkdownImage {...(props as any)} />,
                  h2: ({ node, children }) => <HeadingRenderer level={2}>{children}</HeadingRenderer>,
                  h3: ({ node, children }) => <HeadingRenderer level={3}>{children}</HeadingRenderer>,
                  pre: ({ children }) => <>{children}</>,
                  code: ({ className, children, ...rest }) => {
                    // If it has a language class or is multi-line, render as code block
                    const isBlock = className?.startsWith('language-') ||
                      (typeof children === 'string' && children.includes('\n'));
                    if (isBlock) {
                      return <CodeBlock className={className}>{children}</CodeBlock>;
                    }
                    return <InlineCode>{children}</InlineCode>;
                  },
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          ) : null}

          {/* Tags */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <div className="flex flex-wrap gap-2">
              {meta.tags.map((tag) => (
                <span key={tag} className="px-3 py-1.5 bg-white/[0.03] border border-white/10 text-[10px] font-mono uppercase tracking-widest text-white/40">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Sources */}
          {post && post.sources && post.sources.length > 0 && post.sources[0] !== '' && (
            <div className="mt-10 pt-8 border-t border-white/10">
              <h3 className="text-[10px] uppercase tracking-widest font-mono text-white/40 mb-4">Sources & References</h3>
              <ol className="space-y-2 list-decimal list-inside">
                {post.sources.map((source, i) => (
                  <li key={i} className="text-sm text-white/30">
                    <a href={source} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors font-mono text-xs break-all">
                      {source}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Author card */}
          <div className="mt-16 p-8 bg-white/[0.02] border border-white/10">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white/30" />
              </div>
              <div>
                <p className="font-medium mb-1">{meta.author}</p>
                <p className="text-sm text-white/40 leading-relaxed">
                  SaaS Architect & AI Systems Engineer. 10+ years shipping production infrastructure across fintech, automotive, e-commerce, and healthcare.
                </p>
              </div>
            </div>
          </div>

          {/* Prev / Next navigation */}
          <div className="mt-20 grid md:grid-cols-2 gap-8 border-t border-white/10 pt-16">
            {prevPost ? (
              <Link to={`/blog/${prevPost.slug}`} className="group">
                <p className="text-[10px] uppercase tracking-widest font-mono text-white/30 mb-3">&larr; Previous</p>
                <h3 className="text-lg font-medium tracking-tight group-hover:text-white/70 transition-colors leading-snug">
                  {prevPost.title}
                </h3>
              </Link>
            ) : <div />}

            {nextPost ? (
              <Link to={`/blog/${nextPost.slug}`} className="group text-right">
                <p className="text-[10px] uppercase tracking-widest font-mono text-white/30 mb-3">Next &rarr;</p>
                <h3 className="text-lg font-medium tracking-tight group-hover:text-white/70 transition-colors leading-snug">
                  {nextPost.title}
                </h3>
              </Link>
            ) : <div />}
          </div>
        </article>
      </div>
    </motion.div>
  );
}
