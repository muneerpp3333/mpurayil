'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ShoppingBag, Zap, Clock, Monitor } from 'lucide-react';
import Link from 'next/link';
import { templates, getTemplatesByCategory, type Template } from '@/src/data/templates';

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-4 mb-12">
    <div className="h-[1px] w-12 bg-white/20" />
    <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-white/40">{children}</span>
  </div>
);

/* --- Lens glare card --- */
function GlareCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setGlare({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
      opacity: 1,
    });
  }, []);

  const handleLeave = useCallback(() => {
    setGlare(prev => ({ ...prev, opacity: 0 }));
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`relative overflow-hidden ${className}`}
    >
      <div
        className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-500"
        style={{
          opacity: glare.opacity,
          background: `radial-gradient(350px circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.06), transparent 60%)`,
        }}
      />
      {children}
    </div>
  );
}

/* --- Category filter pill --- */
const FilterPill = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-mono border transition-all duration-300 ${
      active
        ? 'border-white/40 text-white bg-white/[0.06]'
        : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'
    }`}
  >
    {label}
  </button>
);

/* --- Template card --- */
const TemplateCard = ({ template }: { template: Template }) => (
  <GlareCard>
    <Link
      href={`/templates/${template.slug}`}
      className="group bg-onyx flex flex-col transition-colors relative block border border-white/10"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[3/2]">
        <img
          src={template.image}
          alt={template.shortTitle}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-onyx/60 to-transparent" />
        {/* Category badge */}
        <span className="absolute top-4 left-4 px-3 py-1 bg-onyx/80 backdrop-blur-sm border border-white/10 text-[9px] font-mono uppercase tracking-widest text-white/60">
          {template.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-8 flex flex-col flex-1">
        <h3 className="text-lg font-medium tracking-tight mb-3 group-hover:translate-x-1 transition-transform duration-300 leading-snug">
          {template.shortTitle}
        </h3>
        <p className="text-white/40 text-sm leading-relaxed mb-6 line-clamp-2">
          {template.description}
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-6 min-h-[28px]">
          {template.features.slice(0, 3).map((f) => (
            <span key={f} className="px-2 py-1 text-[9px] font-mono uppercase tracking-widest text-white/30 border border-white/5">
              {f}
            </span>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-6 border-t border-white/5">
          <div>
            <span className="text-2xl font-medium tracking-tight">{template.price}</span>
            <span className="text-sm text-white/40 ml-1">{template.currency}</span>
          </div>
          <span className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">
            View <ArrowUpRight className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform duration-300" />
          </span>
        </div>
      </div>
    </Link>
  </GlareCard>
);

/* ======================================= */
/* --- MAIN COMPONENT --- */
/* ======================================= */
export default function TemplatesClient() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'Website' | 'Shopify'>('all');
  const filtered = getTemplatesByCategory(activeCategory);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-20"
    >
      {/* =============== HERO =============== */}
      <section className="py-32 md:py-40 px-6">
        <div className="max-w-[1400px] mx-auto">
          <SectionLabel>Ready-Made Solutions</SectionLabel>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-5xl md:text-7xl font-medium tracking-tighter mb-8 leading-[0.95]">
              Production-grade templates.<br />
              <span className="text-white/40">Ready to ship.</span>
            </h1>
            <p className="text-xl text-white/50 leading-relaxed max-w-2xl mb-12">
              High-converting website templates designed and built by our team. Each one is mobile-responsive, SEO-optimized, and delivered in 7 days. No compromises.
            </p>
          </motion.div>

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-8 border-t border-white/10 pt-10 max-w-2xl">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ShoppingBag className="w-4 h-4 text-white/30" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">Templates</span>
              </div>
              <p className="text-2xl font-medium tracking-tight">{templates.length}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-white/30" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">Delivery</span>
              </div>
              <p className="text-2xl font-medium tracking-tight">7 Days</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Monitor className="w-4 h-4 text-white/30" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">Starting At</span>
              </div>
              <p className="text-2xl font-medium tracking-tight">1499 <span className="text-sm text-white/40">AED</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* =============== FILTER + GRID =============== */}
      <section className="px-6 pb-32">
        <div className="max-w-[1400px] mx-auto">
          {/* Filters */}
          <div className="flex items-center gap-4 mb-12">
            <FilterPill label="All" active={activeCategory === 'all'} onClick={() => setActiveCategory('all')} />
            <FilterPill label="Website" active={activeCategory === 'Website'} onClick={() => setActiveCategory('Website')} />
            <FilterPill label="Shopify" active={activeCategory === 'Shopify'} onClick={() => setActiveCategory('Shopify')} />
            <span className="text-[10px] font-mono text-white/20 ml-4">{filtered.length} results</span>
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((template) => (
              <TemplateCard key={template.slug} template={template} />
            ))}
          </div>

          {/* CTA strip */}
          <div className="mt-20 border-t border-white/10 pt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl font-medium tracking-tight mb-2">Need something custom?</h3>
              <p className="text-white/40 max-w-lg">These templates cover common use cases. For bespoke architecture and design, let's discuss your project directly.</p>
            </div>
            <a
              href="#intake"
              className="group flex items-center gap-6 border border-white/20 px-8 py-5 hover:bg-white hover:text-black transition-all duration-500 relative overflow-hidden shrink-0"
            >
              <span className="absolute inset-0 bg-white scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-mono relative z-10">Discuss Your Project</span>
              <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform duration-500 relative z-10" />
            </a>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
