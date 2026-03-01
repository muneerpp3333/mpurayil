import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowUpRight, Layers, Smartphone, Brain, Zap, Clock, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getSiteJsonLd, getAllPosts } from '../lib/blog';
import { getFeaturedTemplates } from '../data/templates';
import SEOHead from '../components/SEOHead';

/* ─── Dot grid background ─── */
function DotGrid() {
  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}
    />
  );
}

/* ─── Mouse-following spotlight for hero ─── */
function HeroSpotlight() {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  return (
    <div ref={ref} onMouseMove={handleMove} className="absolute inset-0 z-[1] pointer-events-auto">
      <div
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-700"
        style={{
          background: `radial-gradient(600px circle at ${pos.x}% ${pos.y}%, rgba(255,255,255,0.03), transparent 60%)`,
        }}
      />
    </div>
  );
}

/* ─── Magnetic button wrapper ─── */
function MagneticButton({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.15);
    y.set((e.clientY - centerY) * 0.15);
  }, [x, y]);

  const handleLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Tilt card for niche section ─── */
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 200, damping: 25 });
  const springRotateY = useSpring(rotateY, { stiffness: 200, damping: 25 });

  const handleMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(y * -6);
    rotateY.set(x * 6);
  }, [rotateX, rotateY]);

  const handleLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformPerspective: 800,
        transformStyle: 'preserve-3d',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Blog card with lens glare ─── */
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
      {/* Lens glare */}
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

/* ─── Animated counter ─── */
function AnimatedStat({ value, label }: { value: string; label: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.5 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <p className="text-[10px] uppercase tracking-[0.2em] font-mono text-white/40 mb-2">{label}</p>
      <motion.p
        className="text-3xl font-medium tracking-tight"
        initial={{ opacity: 0, y: 12 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {value}
      </motion.p>
    </div>
  );
}

/* ─── Sub-components ─── */
const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-4 mb-12">
    <div className="h-[1px] w-12 bg-white/20" />
    <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-white/40">{children}</span>
  </div>
);

const EngagementCard = ({ title, metric, description, context }: { title: string; metric: string; description: string; context: string }) => (
  <motion.div
    className="group border-t border-white/10 py-12 grid md:grid-cols-[1fr_2fr] gap-8 hover:bg-white/[0.02] transition-colors px-4 -mx-4 relative overflow-hidden"
    whileHover={{ x: 4 }}
    transition={{ duration: 0.3 }}
  >
    {/* Hover accent line */}
    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />
    <div>
      <p className="text-3xl font-medium tracking-tight mb-2">{metric}</p>
      <p className="text-[10px] uppercase tracking-widest font-mono text-white/40">{context}</p>
    </div>
    <div>
      <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
        {title} <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      </h3>
      <p className="text-white/60 leading-relaxed max-w-xl">{description}</p>
    </div>
  </motion.div>
);

const ArsenalTag = ({ children, highlight = false }: { children: string; highlight?: boolean }) => (
  <motion.span
    whileHover={{ scale: 1.05, y: -1 }}
    transition={{ duration: 0.2 }}
    className={`px-3 py-1.5 text-xs font-mono border transition-colors duration-300 cursor-default hover:border-white/30 ${
      highlight
        ? 'border-white/20 text-white bg-white/[0.04]'
        : 'border-white/10 text-white/50 bg-white/[0.02]'
    }`}
  >
    {children}
  </motion.span>
);

/* ═══════════════════════════════════════ */
/* ─── MAIN COMPONENT ─── */
/* ═══════════════════════════════════════ */
export default function Home() {
  const siteJsonLd = getSiteJsonLd();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-20"
    >
      <SEOHead
        title="Muneer Puthiya Purayil | SaaS Architect & AI Systems Engineer"
        description="SaaS architect and AI systems engineer with 10+ years shipping production infrastructure. Focused on scalable architecture, agentic AI, and enterprise mobile."
        jsonLd={siteJsonLd}
      />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="min-h-[90vh] flex items-center px-6 relative overflow-hidden">
        {/* Dot grid */}
        <DotGrid />

        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://fastly.picsum.photos/id/273/1920/1080.jpg?blur=2&grayscale&hmac=F3OUrC_miQTfa36bq4C707IQzceSHM7Rl3GuRCibgbk"
            alt=""
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-onyx via-onyx/95 to-transparent" />
        </div>

        {/* Mouse-tracking spotlight */}
        <HeroSpotlight />

        <div className="max-w-[1400px] mx-auto w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest font-mono text-white/60 mb-8">
                <Zap className="w-3 h-3 text-white" />
                Accepting engagements · Q3/Q4 2026
              </div>
              <h1 className="text-[clamp(2.5rem,6vw,5.5rem)] font-medium leading-[0.95] tracking-tighter mb-10 text-balance">
                Architecture that<br />
                scales. Code that ships.
              </h1>
              <p className="text-xl md:text-2xl text-white/60 leading-relaxed max-w-xl mb-8 text-balance">
                10+ years building production SaaS, agentic AI systems, and enterprise mobile at companies like Tekion ($4B), Mashreq Bank, and FragranceNet. Currently open for high-impact engagements.
              </p>
              {/* Social proof line */}
              <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-12">
                Tekion ($4B) · Mashreq Bank · FragranceNet · Sonder · mfine
              </p>
              <div className="flex flex-wrap gap-6">
                <MagneticButton>
                  <a
                    href="#intake"
                    className="group flex items-center gap-8 border border-white/20 px-10 py-6 hover:bg-white hover:text-black transition-all duration-500 relative overflow-hidden"
                  >
                    {/* Sweep fill effect */}
                    <span className="absolute inset-0 bg-white scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
                    <span className="text-[10px] uppercase tracking-[0.2em] font-mono relative z-10">Discuss Your Project</span>
                    <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500 relative z-10" />
                  </a>
                </MagneticButton>
                <Link
                  to="/portfolio"
                  className="group flex items-center gap-6 px-10 py-6 text-white/40 hover:text-white transition-all duration-500"
                >
                  <span className="text-[10px] uppercase tracking-[0.2em] font-mono">See the Work</span>
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="hidden lg:block relative"
            >
              <div className="aspect-[4/5] brutalist-border overflow-hidden relative group">
                <img
                  src="https://fastly.picsum.photos/id/564/800/1000.jpg?grayscale&hmac=1phFPCCOxBaGpT_FZT99hXfR7uDUsjDf9m-v7beTS0Y"
                  alt="Muneer Puthiya Purayil"
                  className="w-full h-full object-cover grayscale brightness-75 group-hover:scale-105 group-hover:brightness-90 transition-all duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-onyx/80 to-transparent" />
                {/* Scan line effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
                  <div className="absolute inset-x-0 h-[1px] bg-white/20 animate-scan" />
                </div>
                <div className="absolute bottom-8 left-8">
                  <p className="text-sm font-mono tracking-widest text-white/40 mb-2">CURRENT LOCATION</p>
                  <p className="text-xl font-medium">DUBAI, UAE</p>
                </div>
              </div>
              {/* Floating Metric with hover pulse */}
              <motion.div
                className="absolute -top-8 -right-8 bg-white text-black p-8 brutalist-border shadow-2xl cursor-default"
                whileHover={{ scale: 1.05, rotate: -1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                <p className="text-4xl font-medium tracking-tighter">300%</p>
                <p className="text-[10px] uppercase tracking-widest font-mono font-bold">Perf. Boost</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ STATS BAR ═══════════════ */}
      <section className="py-20 px-6 border-y border-white/5 relative">
        <DotGrid />
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
          {[
            { label: 'Years in Production', value: '10+' },
            { label: 'Highest-Value Platform', value: '$4B' },
            { label: 'App Downloads', value: '500k+' },
            { label: 'Banking Crash Rate', value: '<0.1%' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <AnimatedStat value={stat.value} label={stat.label} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════ NICHE DOMINANCE ═══════════════ */}
      <section className="py-32 px-6 relative">
        <DotGrid />
        <div className="max-w-[1400px] mx-auto relative z-10">
          <SectionLabel>What I Build</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">Niche Dominance.</h2>
          <p className="text-white/40 text-lg max-w-lg mb-16">Three disciplines. One stack. All production-tested.</p>

          <div className="grid md:grid-cols-3 gap-[1px] bg-white/10 border border-white/10">
            {[
              {
                icon: <Brain className="w-8 h-8" />,
                title: 'Agentic AI & LLM Systems',
                desc: 'Production-grade AI infrastructure: agentic workflows, RAG pipelines, and fine-tuned LLMs deployed to real users at scale. Not prototypes.',
                tags: ['LangChain', 'RAG', 'Qdrant', 'pgvector', 'OpenAI', 'Claude'],
              },
              {
                icon: <Layers className="w-8 h-8" />,
                title: 'High-Throughput SaaS',
                desc: 'Microservices, event-driven systems, and multi-tenant infrastructure built for extreme load. Designed to scale from thousands to millions of users without rearchitecting.',
                tags: ['NestJS', 'Kubernetes', 'Docker', 'GraphQL', 'RabbitMQ'],
              },
              {
                icon: <Smartphone className="w-8 h-8" />,
                title: 'Enterprise Mobile Commerce',
                desc: 'Performance-focused React Native ecosystems with CI/CD pipelines delivering zero-downtime releases. 500k+ installs. Sub-second interactions. Sub-0.1% crash rates.',
                tags: ['React Native', 'OTA', 'CI/CD', 'AWS', 'GitHub Actions'],
              },
            ].map((item, i) => (
              <TiltCard key={i}>
                <div className="bg-onyx p-12 flex flex-col justify-between min-h-[450px] group hover:bg-white/[0.02] transition-colors relative overflow-hidden">
                  {/* Corner glow on hover */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/[0.02] rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div>
                    <div className="text-white/30 mb-8 group-hover:text-white/50 transition-colors duration-500">
                      <motion.div whileHover={{ rotate: 8, scale: 1.1 }} transition={{ duration: 0.3 }}>
                        {item.icon}
                      </motion.div>
                    </div>
                    <h3 className="text-2xl font-medium mb-4">{item.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed mb-8">{item.desc}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-white/[0.03] border border-white/10 text-[10px] font-mono text-white/40"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ SELECT ENGAGEMENTS ═══════════════ */}
      <section className="py-32 px-6 bg-white/[0.02] relative">
        <div className="max-w-[1400px] mx-auto relative z-10">
          <SectionLabel>Track Record</SectionLabel>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">Select Engagements.</h2>
              <p className="text-white/40 text-lg max-w-lg">Measured in outcomes, not job titles.</p>
            </div>
            <Link
              to="/portfolio"
              className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-mono text-white/40 hover:text-white transition-colors"
            >
              View all engagements <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
            </Link>
          </div>

          <div className="mt-12">
            <EngagementCard
              title="Scaling Platform Architecture for $4B Unicorn"
              metric="300%+"
              context="Performance Optimization · Tekion Corp"
              description="Re-engineered the checkout and payment pipeline for global automotive dealerships. Transaction times dropped from 45s to 15s. Worked alongside founding engineers during the platform's scale to $4B valuation."
            />
            <EngagementCard
              title="Intelligent Push Notification Engine"
              metric="30%"
              context="Revenue Growth · FragranceNet.com"
              description="Built a behavioral segmentation engine with real-time triggers. Result: 30% uplift in mobile sales and measurable lift in customer lifetime value."
            />
            <EngagementCard
              title="Mission-Critical Banking Infrastructure"
              metric="<0.1%"
              context="Crash Rate · Mashreq Digital Bank"
              description="Built a regulated-grade onboarding system for iOS and Android, deployed across 50+ bank branches. Sub-0.1% crash rate in a zero-tolerance financial environment."
            />
            <EngagementCard
              title="Microservices Migration & Scalability"
              metric="35%"
              context="Scalability Improvement · FragranceNet.com"
              description="Migrated monolithic inventory system to NestJS microservices with distributed architecture. 35% improvement in system scalability and operational throughput."
            />
          </div>
        </div>
      </section>

      {/* ═══════════════ TECH ARSENAL ═══════════════ */}
      <section className="py-32 px-6 relative">
        <DotGrid />
        <div className="max-w-[1400px] mx-auto relative z-10">
          <SectionLabel>Infrastructure</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">The Arsenal.</h2>
          <p className="text-white/40 text-lg max-w-lg mb-16">Everything here runs in production. Nothing theoretical.</p>

          <div className="grid md:grid-cols-2 gap-[1px] bg-white/10 border border-white/10">
            <div className="bg-onyx p-10 group hover:bg-white/[0.015] transition-colors">
              <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-white/40 mb-6">AI / ML & Intelligent Systems</div>
              <div className="flex flex-wrap gap-2">
                <ArsenalTag highlight>LangChain</ArsenalTag>
                <ArsenalTag highlight>RAG Pipelines</ArsenalTag>
                <ArsenalTag highlight>Agentic Workflows</ArsenalTag>
                <ArsenalTag>Qdrant</ArsenalTag>
                <ArsenalTag>pgvector</ArsenalTag>
                <ArsenalTag>OpenAI</ArsenalTag>
                <ArsenalTag>Claude</ArsenalTag>
                <ArsenalTag>Fine-tuned Models</ArsenalTag>
                <ArsenalTag>Prompt Engineering</ArsenalTag>
                <ArsenalTag>NLP</ArsenalTag>
              </div>
            </div>
            <div className="bg-onyx p-10 group hover:bg-white/[0.015] transition-colors">
              <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-white/40 mb-6">Platforms & DevOps</div>
              <div className="flex flex-wrap gap-2">
                <ArsenalTag highlight>Kubernetes (K3s)</ArsenalTag>
                <ArsenalTag highlight>Docker</ArsenalTag>
                <ArsenalTag>AWS</ArsenalTag>
                <ArsenalTag>GCP</ArsenalTag>
                <ArsenalTag>CI/CD Pipelines</ArsenalTag>
                <ArsenalTag>Firebase</ArsenalTag>
                <ArsenalTag>ElasticSearch</ArsenalTag>
                <ArsenalTag>Kibana</ArsenalTag>
                <ArsenalTag>PostgreSQL</ArsenalTag>
              </div>
            </div>
            <div className="bg-onyx p-10 group hover:bg-white/[0.015] transition-colors">
              <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-white/40 mb-6">Frameworks & Runtime</div>
              <div className="flex flex-wrap gap-2">
                <ArsenalTag highlight>NestJS</ArsenalTag>
                <ArsenalTag highlight>Next.js</ArsenalTag>
                <ArsenalTag highlight>React Native</ArsenalTag>
                <ArsenalTag>React</ArsenalTag>
                <ArsenalTag>GraphQL</ArsenalTag>
                <ArsenalTag>RabbitMQ</ArsenalTag>
                <ArsenalTag>Node.js</ArsenalTag>
                <ArsenalTag>TypeScript</ArsenalTag>
              </div>
            </div>
            <div className="bg-onyx p-10 group hover:bg-white/[0.015] transition-colors">
              <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-white/40 mb-6">Architecture & Systems Design</div>
              <div className="flex flex-wrap gap-2">
                <ArsenalTag>Microservices</ArsenalTag>
                <ArsenalTag>Event-Driven Systems</ArsenalTag>
                <ArsenalTag>API-first Design</ArsenalTag>
                <ArsenalTag>Multi-Tenant Infra</ArsenalTag>
                <ArsenalTag>Self-Hosted SaaS</ArsenalTag>
                <ArsenalTag>No-Code Builders</ArsenalTag>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ FROM THE JOURNAL ═══════════════ */}
      <section className="py-32 px-6 bg-white/[0.02] relative">
        <div className="max-w-[1400px] mx-auto relative z-10">
          <SectionLabel>From the Journal</SectionLabel>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">Recent Writing.</h2>
              <p className="text-white/40 text-lg max-w-lg">Notes on architecture, systems design, and agentic AI. Drawn from production work, not theory.</p>
            </div>
            <Link
              to="/blog"
              className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-mono text-white/40 hover:text-white transition-colors shrink-0"
            >
              All articles <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-[1px] bg-white/10 border border-white/10">
            {getAllPosts().slice(0, 3).map((post) => (
              <GlareCard key={post.slug}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="group bg-onyx p-8 md:p-10 flex flex-col justify-between min-h-[360px] transition-colors relative block"
                >

                <div>
                  <div className="flex items-center gap-4 mb-6 text-[10px] font-mono uppercase tracking-widest text-white/30">
                    <span className="flex items-center gap-1.5"><Tag className="w-3 h-3" /> {post.category}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {post.readTime}</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-medium tracking-tight mb-4 group-hover:translate-x-1 transition-transform duration-300">
                    {post.title}
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                  <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
                    {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-white/60 group-hover:rotate-45 transition-all duration-300" />
                </div>
              </Link>
              </GlareCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ READY-MADE TEMPLATES ═══════════════ */}
      <section className="py-32 px-6 relative">
        <div className="max-w-[1400px] mx-auto relative z-10">
          <SectionLabel>Ready-Made Solutions</SectionLabel>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">Website Templates.</h2>
              <p className="text-white/40 text-lg max-w-lg">Production-grade, conversion-optimized templates. Live in 7 days, starting at 1499 AED.</p>
            </div>
            <Link
              to="/templates"
              className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-mono text-white/40 hover:text-white transition-colors shrink-0"
            >
              View all templates <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-[1px] bg-white/10 border border-white/10">
            {getFeaturedTemplates(3).map((template) => (
              <GlareCard key={template.slug}>
                <Link
                  to={`/templates/${template.slug}`}
                  className="group bg-onyx flex flex-col min-h-[400px] transition-colors relative block"
                >
                  <div className="relative overflow-hidden aspect-[3/2]">
                    <img
                      src={template.image}
                      alt={template.shortTitle}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-onyx/60 to-transparent" />
                    <span className="absolute top-4 left-4 px-3 py-1 bg-onyx/80 backdrop-blur-sm border border-white/10 text-[9px] font-mono uppercase tracking-widest text-white/60">
                      {template.category}
                    </span>
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <h3 className="text-lg font-medium tracking-tight mb-3 group-hover:translate-x-1 transition-transform duration-300">
                      {template.shortTitle}
                    </h3>
                    <p className="text-white/40 text-sm leading-relaxed mb-6 line-clamp-2 flex-1">
                      {template.description}
                    </p>
                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      <div>
                        <span className="text-xl font-medium tracking-tight">{template.price}</span>
                        <span className="text-sm text-white/40 ml-1">{template.currency}</span>
                      </div>
                      <span className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">
                        View <ArrowUpRight className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform duration-300" />
                      </span>
                    </div>
                  </div>
                </Link>
              </GlareCard>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
