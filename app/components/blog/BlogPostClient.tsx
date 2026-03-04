'use client';

import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowUpRight, Clock, Calendar, User, List, Copy, Check, Maximize2, X, FileCode, ChevronDown, Linkedin, Twitter, Link2 } from 'lucide-react';
import Link from 'next/link';
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
import java from 'highlight.js/lib/languages/java';
import diff from 'highlight.js/lib/languages/diff';
import type { BlogPost } from '@/app/lib/blog';
import { trackCTAClick, trackBlogView, trackBlogScrollDepth, trackBlogShare, trackFAQOpen, trackExternalLink } from '@/app/lib/analytics';

/* --- Register highlight.js languages --- */
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
hljs.registerLanguage('java', java);
hljs.registerLanguage('diff', diff);

/* --- TOC types --- */
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

/* --- Sidebar TOC (desktop: sticky, mobile: collapsible) --- */
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
          {/* Sidebar CTA */}
          <div className="mt-10 pt-8 border-t border-white/10">
            <p className="text-[11px] text-white/50 leading-relaxed mb-4">Need help building this?</p>
            <a
              href="https://calendly.com/gitspark/discussion-with-gitspark"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCTAClick('calendly', 'sidebar_cta')}
              className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-mono text-white/60 hover:text-white transition-colors"
            >
              Free strategy call <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
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

/* --- Inline image with caption, sizing & lightbox --- */
/*
  Markdown convention:
    ![alt text](src)                     -- full width, no caption
    ![alt text | caption](src)           -- full width + caption
    ![alt text | caption | half](src)    -- half width + caption
    ![alt text | caption | sm](src)      -- small inline (300px)
    ![alt text | | half-right](src)      -- half width, float right, no caption
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

/* --- Code block with syntax highlighting, copy, language label --- */
function CodeBlock({ children, className }: { children?: React.ReactNode; className?: string }) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

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

/* --- Inline code (not code blocks) --- */
function InlineCode({ children }: { children?: React.ReactNode }) {
  return (
    <code className="text-white/80 bg-white/[0.06] px-1.5 py-0.5 text-[0.9em] font-mono rounded border border-white/5">
      {children}
    </code>
  );
}

/* --- Custom heading renderer that adds id for TOC anchors --- */
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

  const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;

  return <Tag id={id}>{children}</Tag>;
}

/* --- FAQ Accordion --- */
interface FaqItem {
  question: string;
  answer: string;
}

/** Strip ## Related Reading section from markdown (handled by relatedPosts component) */
function stripRelatedReading(markdown: string): string {
  return markdown.replace(/\n## Related Reading[\s\S]*$/, '').trimEnd();
}

function extractFaqSection(markdown: string): { contentBeforeFaq: string; faqItems: FaqItem[]; contentAfterFaq: string } | null {
  const faqStart = markdown.match(/^## (?:FAQ|Frequently Asked Questions)\s*$/m);
  if (!faqStart || faqStart.index === undefined) return null;

  const beforeFaq = markdown.slice(0, faqStart.index);
  const afterStart = markdown.slice(faqStart.index + faqStart[0].length);

  // Find where FAQ ends (next ## heading that isn't a ### question)
  const nextH2 = afterStart.match(/\n## (?!#)/);
  const faqBlock = nextH2 && nextH2.index !== undefined ? afterStart.slice(0, nextH2.index) : afterStart;
  const afterFaq = nextH2 && nextH2.index !== undefined ? stripRelatedReading(afterStart.slice(nextH2.index)) : '';

  const items: FaqItem[] = [];
  const questions = faqBlock.split(/\n### /).filter(Boolean);
  for (const q of questions) {
    const lines = q.trim().split('\n');
    const question = lines[0].replace(/^\*\*|\*\*$/g, '').trim();
    const answer = lines.slice(1).join('\n').trim();
    if (question && answer) {
      items.push({ question, answer });
    }
  }

  if (items.length === 0) return null;
  return { contentBeforeFaq: beforeFaq, faqItems: items, contentAfterFaq: afterFaq };
}

function FaqAccordion({ items, slug }: { items: FaqItem[]; slug?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="my-20">
      <h2 className="text-[1.75rem] font-medium tracking-tight mb-8 text-white" id="faq">FAQ</h2>
      <div className="border-t border-white/10">
        {items.map((item, i) => (
          <div key={i} className="border-b border-white/10">
            <button
              onClick={() => {
                const next = openIndex === i ? null : i;
                setOpenIndex(next);
                if (next !== null && slug) trackFAQOpen(slug, item.question);
              }}
              className="flex items-center justify-between w-full py-5 text-left group"
            >
              <span className="text-[1.05rem] font-medium text-white/80 group-hover:text-white transition-colors pr-4">
                {item.question}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-white/30 shrink-0 transition-transform duration-200 ${openIndex === i ? 'rotate-180' : ''}`}
              />
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pb-6 text-white/60 text-[1.05rem] leading-[1.85]">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

/* --- Inline mid-article CTA --- */
function InlineCTA({ category }: { category: string }) {
  const topic = category === 'AI Architecture' ? 'AI systems' : category === 'DevOps' ? 'DevOps pipelines' : category.toLowerCase();
  return (
    <div className="my-16 py-8 px-8 border-l-2 border-white/20 bg-white/[0.02]">
      <p className="text-white/80 font-medium mb-2">Need a second opinion on your {topic} architecture?</p>
      <p className="text-white/40 text-sm mb-5">I run free 30-minute strategy calls for engineering teams tackling this exact problem.</p>
      <a
        href="https://calendly.com/gitspark/discussion-with-gitspark"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackCTAClick('calendly', 'inline_cta')}
        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-mono text-white hover:text-white/70 transition-colors"
      >
        Book a Free Call <ArrowUpRight className="w-3 h-3" />
      </a>
    </div>
  );
}

/** Split markdown content at ~50% for mid-article CTA insertion */
function splitContentAtMidpoint(markdown: string): [string, string] | null {
  const lines = markdown.split('\n');
  const h2Indices: number[] = [];
  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('```')) { inCodeBlock = !inCodeBlock; continue; }
    if (inCodeBlock) continue;
    if (lines[i].match(/^## /)) h2Indices.push(i);
  }

  if (h2Indices.length < 3) return null; // too short for mid-article CTA

  const midIndex = h2Indices[Math.floor(h2Indices.length / 2)];
  return [lines.slice(0, midIndex).join('\n'), lines.slice(midIndex).join('\n')];
}

/* --- Share buttons --- */
function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const url = `https://mpurayil.com/blog/${slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-[10px] uppercase tracking-widest font-mono text-white/25">Share</span>
      <div className="flex gap-2">
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackBlogShare(slug, 'linkedin')}
          className="p-2.5 border border-white/10 text-white/30 hover:text-white hover:border-white/30 transition-colors"
          aria-label="Share on LinkedIn"
        >
          <Linkedin className="w-3.5 h-3.5" />
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackBlogShare(slug, 'twitter')}
          className="p-2.5 border border-white/10 text-white/30 hover:text-white hover:border-white/30 transition-colors"
          aria-label="Share on X"
        >
          <Twitter className="w-3.5 h-3.5" />
        </a>
        <button
          onClick={() => { handleCopyLink(); trackBlogShare(slug, 'copy_link'); }}
          className="p-2.5 border border-white/10 text-white/30 hover:text-white hover:border-white/30 transition-colors"
          aria-label="Copy link"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Link2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}

/* --- Prose styles --- */
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

/* --- Props --- */
interface RelatedPost {
  slug: string;
  title: string;
  category: string;
  readTime: string;
}

interface BlogPostClientProps {
  post: BlogPost;
  prevPost: { slug: string; title: string } | null;
  nextPost: { slug: string; title: string } | null;
  relatedPosts?: RelatedPost[];
}

/* --- Shared ReactMarkdown components config --- */
const markdownComponents = {
  img: ({ node, ...props }: any) => <MarkdownImage {...props} />,
  h2: ({ node, children }: any) => <HeadingRenderer level={2}>{children}</HeadingRenderer>,
  h3: ({ node, children }: any) => <HeadingRenderer level={3}>{children}</HeadingRenderer>,
  pre: ({ children }: any) => <>{children}</>,
  code: ({ className, children }: any) => {
    const isBlock = className?.startsWith('language-') ||
      (typeof children === 'string' && children.includes('\n'));
    if (isBlock) {
      return <CodeBlock className={className}>{children}</CodeBlock>;
    }
    return <InlineCode>{children}</InlineCode>;
  },
};

/* --- Reading progress bar --- */
function ReadingProgress({ slug }: { slug: string }) {
  const [progress, setProgress] = useState(0);
  const milestonesHit = useRef(new Set<number>());

  useEffect(() => {
    const handleScroll = () => {
      const article = document.querySelector('article');
      if (!article) return;
      const rect = article.getBoundingClientRect();
      const articleTop = rect.top + window.scrollY;
      const articleHeight = rect.height;
      const scrolled = window.scrollY - articleTop;
      const pct = Math.min(100, Math.max(0, (scrolled / (articleHeight - window.innerHeight)) * 100));
      setProgress(pct);
      // Track scroll milestones at 25%, 50%, 75%, 100%
      for (const milestone of [25, 50, 75, 100]) {
        if (pct >= milestone && !milestonesHit.current.has(milestone)) {
          milestonesHit.current.add(milestone);
          trackBlogScrollDepth(slug, milestone);
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [slug]);

  if (progress <= 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-transparent">
      <div
        className="h-full bg-white/40 transition-[width] duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

/* --- Main component --- */
export default function BlogPostClient({ post, prevPost, nextPost, relatedPosts }: BlogPostClientProps) {
  const cleanContent = useMemo(() => stripRelatedReading(post.content), [post.content]);
  const toc = useMemo(() => extractToc(cleanContent), [cleanContent]);
  const faqData = useMemo(() => extractFaqSection(cleanContent), [cleanContent]);
  const mainContent = faqData ? faqData.contentBeforeFaq : cleanContent;
  const contentSplit = useMemo(() => splitContentAtMidpoint(mainContent), [mainContent]);

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const hasToc = toc.length >= 2;

  useEffect(() => {
    trackBlogView(post.slug, post.category, post.readTime);
  }, [post.slug, post.category, post.readTime]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-40 px-6 pb-32"
    >
      <ReadingProgress slug={post.slug} />

      {/* Full-width header area */}
      <header className="max-w-[800px] mx-auto mb-16">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-mono text-white/40 hover:text-white transition-colors mb-16"
        >
          <ArrowLeft className="w-3 h-3" /> Back to Journal
        </Link>

        {/* Category */}
        <div className="mb-6">
          <span className="px-3 py-1 bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-widest text-white/50">
            {post.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-medium leading-[1.1] tracking-tight mb-8">
          {post.title}
        </h1>

        {/* Excerpt */}
        <p className="text-xl text-white/50 leading-relaxed mb-10 max-w-2xl">
          {post.excerpt}
        </p>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-6 text-[11px] font-mono text-white/40 border-y border-white/10 py-5">
          <span className="flex items-center gap-2">
            <User className="w-3 h-3" />
            {post.author}
          </span>
          <span className="flex items-center gap-2">
            <Calendar className="w-3 h-3" />
            <time dateTime={post.date}>{formattedDate}</time>
          </span>
          <span className="flex items-center gap-2">
            <Clock className="w-3 h-3" /> {post.readTime}
          </span>
          {post.updated && post.updated !== post.date && (
            <span className="text-white/25">
              Updated: <time dateTime={post.updated}>
                {new Date(post.updated).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </time>
            </span>
          )}
        </div>
      </header>

      {/* Cover image -- full article width */}
      {post.coverImage && (
        <figure className="max-w-[800px] mx-auto mb-16">
          <div className="overflow-hidden border border-white/10">
            <img
              src={post.coverImage}
              alt={post.coverAlt || post.title}
              className="w-full h-auto"
            />
          </div>
          {post.coverCaption && (
            <figcaption className="mt-3 text-[11px] font-mono text-white/30 uppercase tracking-wider">
              {post.coverCaption}
            </figcaption>
          )}
        </figure>
      )}

      {/* Two-column layout: sidebar TOC + content */}
      <div className={`max-w-[1200px] mx-auto ${hasToc ? 'xl:grid xl:grid-cols-[200px_1fr] xl:gap-16' : ''}`}>

        {/* Sidebar TOC */}
        {hasToc && <SidebarTOC items={toc} />}

        {/* Article body */}
        <article className="max-w-[800px]" itemScope itemType="https://schema.org/TechArticle">

          {/* Content */}
          <div className={PROSE_CLASSES} itemProp="articleBody">
            {contentSplit ? (
              <>
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={markdownComponents}>
                  {contentSplit[0]}
                </ReactMarkdown>
                <InlineCTA category={post.category} />
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={markdownComponents}>
                  {contentSplit[1]}
                </ReactMarkdown>
              </>
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={markdownComponents}>
                {mainContent}
              </ReactMarkdown>
            )}

            {faqData && (
              <>
                <FaqAccordion items={faqData.faqItems} slug={post.slug} />
                {faqData.contentAfterFaq && (
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={markdownComponents}>
                    {faqData.contentAfterFaq}
                  </ReactMarkdown>
                )}
              </>
            )}
          </div>

          {/* CTA Banner — placed at peak engagement after content/FAQ */}
          <div className="mt-20 p-10 border border-white/10 bg-white/[0.02] text-center">
            <p className="text-[10px] uppercase tracking-widest font-mono text-white/30 mb-4">Need expert help?</p>
            <h3 className="text-2xl font-medium tracking-tight mb-3">
              Building with {post.category === 'AI Architecture' ? 'agentic AI' : post.category === 'DevOps' ? 'CI/CD pipelines' : post.category.toLowerCase()}?
            </h3>
            <p className="text-white/40 mb-8 max-w-lg mx-auto">
              I help teams ship production-grade systems. From architecture review to hands-on builds.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://calendly.com/gitspark/discussion-with-gitspark"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCTAClick('calendly', 'blog_cta_banner')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black text-[10px] uppercase tracking-[0.2em] font-mono font-bold hover:bg-white/90 transition-colors"
              >
                Book a Free Call <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <a
                href="#intake"
                onClick={() => trackCTAClick('intake_form', 'blog_cta_banner')}
                className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white/60 text-[10px] uppercase tracking-[0.2em] font-mono hover:border-white/40 hover:text-white transition-colors"
              >
                Send a Brief
              </a>
            </div>
          </div>

          {/* Tags + Share */}
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-6">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="px-3 py-1.5 bg-white/[0.03] border border-white/10 text-[10px] font-mono uppercase tracking-widest text-white/40 hover:text-white/70 hover:border-white/20 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
            <ShareButtons title={post.title} slug={post.slug} />
          </div>

          {/* Sources */}
          {post.sources && post.sources.length > 0 && post.sources[0] !== '' && (
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
              <Link href="/portfolio" className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 hover:border-white/30 transition-colors">
                <User className="w-5 h-5 text-white/30" />
              </Link>
              <div>
                <Link href="/portfolio" className="font-medium mb-1 hover:text-white/80 transition-colors block">
                  {post.author}
                </Link>
                <p className="text-sm text-white/40 leading-relaxed mb-4">
                  SaaS Architect & AI Systems Engineer. 10+ years shipping production infrastructure across fintech, automotive, e-commerce, and healthcare.
                </p>
                <div className="flex gap-4">
                  <Link href="/portfolio" className="text-[10px] uppercase tracking-widest font-mono text-white/30 hover:text-white transition-colors">
                    View Portfolio
                  </Link>
                  <a href="https://calendly.com/gitspark/discussion-with-gitspark" target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-widest font-mono text-white/30 hover:text-white transition-colors">
                    Book a Call
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts && relatedPosts.length > 0 && (
            <div className="mt-20 pt-16 border-t border-white/10">
              <p className="text-[10px] uppercase tracking-widest font-mono text-white/30 mb-8">Related Articles</p>
              <div className="grid gap-6">
                {relatedPosts.map((rp) => (
                  <Link
                    key={rp.slug}
                    href={`/blog/${rp.slug}`}
                    className="group flex items-center justify-between gap-6 py-5 border-b border-white/5 hover:border-white/15 transition-colors"
                  >
                    <div>
                      <h4 className="font-medium tracking-tight group-hover:text-white/80 transition-colors mb-1">
                        {rp.title}
                      </h4>
                      <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-widest text-white/25">
                        <span>{rp.category}</span>
                        <span>{rp.readTime}</span>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-white/15 group-hover:text-white/50 transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Prev / Next navigation */}
          <div className="mt-20 grid md:grid-cols-2 gap-8 border-t border-white/10 pt-16">
            {prevPost ? (
              <Link href={`/blog/${prevPost.slug}`} className="group">
                <p className="text-[10px] uppercase tracking-widest font-mono text-white/30 mb-3">&larr; Previous</p>
                <h3 className="text-lg font-medium tracking-tight group-hover:text-white/70 transition-colors leading-snug">
                  {prevPost.title}
                </h3>
              </Link>
            ) : <div />}

            {nextPost ? (
              <Link href={`/blog/${nextPost.slug}`} className="group text-right">
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
