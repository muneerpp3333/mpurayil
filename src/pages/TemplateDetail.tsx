import React, { useRef, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  ArrowUpRight,
  ArrowLeft,
  Check,
  Clock,
  Monitor,
  Smartphone,
  Shield,
  Zap,
  Star,
  ChevronDown,
  Info,
} from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { getTemplateBySlug, getRelatedTemplates } from '../data/templates';

/* ─── Lens glare card ─── */
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
  const handleLeave = useCallback(() => setGlare((prev) => ({ ...prev, opacity: 0 })), []);
  return (
    <div ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave} className={`relative overflow-hidden ${className}`}>
      <div
        className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-500"
        style={{ opacity: glare.opacity, background: `radial-gradient(350px circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.06), transparent 60%)` }}
      />
      {children}
    </div>
  );
}

/* ─── FAQ Accordion ─── */
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-white/10">
      <button onClick={() => setOpen(!open)} className="w-full py-6 flex items-center justify-between text-left group">
        <span className="text-base font-medium tracking-tight group-hover:translate-x-1 transition-transform duration-300">{question}</span>
        <ChevronDown className={`w-5 h-5 text-white/40 shrink-0 ml-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden"
      >
        <p className="text-white/50 leading-relaxed pb-6 max-w-2xl text-sm">{answer}</p>
      </motion.div>
    </div>
  );
}

/* ─── Preview gallery with clickable thumbnails ─── */
function PreviewGallery({ images, labels, alt }: { images: string[]; labels?: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      {/* Main image */}
      <div className="border border-white/10 overflow-hidden mb-4 group">
        <img
          src={images[active]}
          alt={labels?.[active] ?? `${alt} Preview ${active + 1}`}
          className="w-full aspect-[16/10] object-contain bg-white/[0.02] group-hover:scale-[1.02] transition-transform duration-700"
        />
      </div>
      {/* Thumbnails row */}
      {images.length > 1 && (
        <div className="grid gap-3 max-w-3xl mx-auto" style={{ gridTemplateColumns: `repeat(${images.length}, 1fr)` }}>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex flex-col items-center gap-2 transition-all duration-300 ${
                i === active ? 'opacity-100' : 'opacity-50 hover:opacity-80'
              }`}
            >
              <div className={`border overflow-hidden w-full transition-colors duration-300 ${
                i === active ? 'border-white/40' : 'border-white/10'
              }`}>
                <img src={img} alt={labels?.[i] ?? `${alt} Preview ${i + 1}`} className="w-full aspect-[16/10] object-contain bg-white/[0.02]" />
              </div>
              <span className={`text-[10px] font-mono uppercase tracking-widest transition-colors duration-300 ${
                i === active ? 'text-white/60' : 'text-white/25'
              }`}>
                {labels?.[i] ?? `Screen ${i + 1}`}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════ */
/* ─── MAIN COMPONENT ─── */
/* ═══════════════════════════════════════ */
export default function TemplateDetail() {
  const { slug } = useParams<{ slug: string }>();
  const template = slug ? getTemplateBySlug(slug) : undefined;

  if (!template) {
    return <Navigate to="/templates" replace />;
  }

  const related = getRelatedTemplates(template.slug, 4);

  const SITE_URL = 'https://muneer.architect';

  // Product schema — rich results in Google (price, rating, availability)
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: template.title,
    description: template.description,
    image: template.image,
    url: `${SITE_URL}/templates/${template.slug}`,
    brand: { '@type': 'Brand', name: 'GitSpark' },
    offers: {
      '@type': 'Offer',
      url: template.orderUrl,
      priceCurrency: 'AED',
      price: template.price,
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Person', name: 'Muneer Puthiya Purayil' },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: '60',
      bestRating: '5',
    },
  };

  // Breadcrumb schema — better SERP display
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Templates', item: `${SITE_URL}/templates` },
      { '@type': 'ListItem', position: 3, name: template.shortTitle, item: `${SITE_URL}/templates/${template.slug}` },
    ],
  };

  // FAQ schema — Google FAQ rich snippet
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [] as object[],
  };

  const faqs = [
    { question: 'What is included in the ready-made website package?', answer: `You receive a fully designed and developed ${template.category === 'Shopify' ? 'Shopify store' : 'website'} with ${template.detailedFeatures.length} core features, mobile-responsive design, SEO optimization, and all content populated. Images and copy are customized to your brand.` },
    { question: 'How long does it take to set up the website?', answer: 'Your website is delivered within 7 business days from the date we receive your brand assets (logo, colors, content). The process is streamlined: order, share assets, review, and go live.' },
    { question: 'Can I customize the website design?', answer: 'Yes. Colors, fonts, images, and copy are all customizable during the review phase. You get one round of revisions included. The overall layout and structure follow the proven template design.' },
    { question: 'Do you offer support after the website is live?', answer: 'Yes. We offer ongoing support packages for content updates, feature additions, and technical maintenance. The website also comes with an easy-to-use CMS so you can make basic changes yourself.' },
    { question: 'Is hosting included with the website package?', answer: `${template.category === 'Shopify' ? 'Shopify hosting is included in your Shopify subscription (separate from the template price).' : 'Hosting setup guidance is included. We recommend reliable providers and can configure hosting for you at no extra cost.'} Domain registration is handled separately.` },
    { question: 'How do I manage the content on my website?', answer: 'The website comes with an easy-to-use content management system. You can update text, images, products, and pages yourself without any technical skills. For structural changes, our team is available.' },
  ];

  // Populate FAQ schema
  faqJsonLd.mainEntity = faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  }));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-20">
      <SEOHead
        seo={{
          title: `${template.shortTitle} | Website Templates | Muneer Puthiya Purayil`,
          description: template.description,
          canonical: `${SITE_URL}/templates/${template.slug}`,
          ogType: 'website',
          ogImage: template.image,
          ogImageAlt: template.shortTitle,
          author: 'Muneer Puthiya Purayil',
          datePublished: '2026-02-01',
          tags: template.features.slice(0, 5),
          category: template.category,
          noindex: false,
        }}
        jsonLd={[productJsonLd, breadcrumbJsonLd, faqJsonLd]}
      />

      {/* ═══════════════ BREADCRUMB ═══════════════ */}
      <div className="px-6 pt-8 pb-4">
        <div className="max-w-[1200px] mx-auto">
          <Link to="/templates" className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to templates
          </Link>
        </div>
      </div>

      {/* ═══════════════ REVIEW MARQUEE ═══════════════ */}
      <div className="overflow-hidden py-4 border-y border-white/5 mb-12">
        <div className="flex gap-16 animate-marquee whitespace-nowrap">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 shrink-0">
              <p className="text-white/30 text-sm italic max-w-md truncate">"Working with this team was a game-changer for my business. Professional and super easy to manage."</p>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-3 h-3 text-white/30 fill-white/30" />)}
                </div>
                <span className="text-[10px] font-mono text-white/20">5.0</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════ HERO: TITLE + IMAGE ═══════════════ */}
      <section className="px-6 pb-16">
        <div className="max-w-[1200px] mx-auto">
          {/* Centered title block */}
          <div className="text-center mb-12">
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30 mb-4">Premium websites for</p>
            <h1 className="text-3xl md:text-5xl font-medium tracking-tighter leading-[1.1] mb-6 max-w-3xl mx-auto">
              {template.title}
            </h1>
            <p className="text-white/40 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              {template.description}
            </p>

            {/* Order button */}
            <div className="mb-6">
              <a
                href={template.orderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-4 border border-white/20 px-10 py-5 hover:bg-white hover:text-black transition-all duration-500 relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-white scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
                <span className="text-[10px] uppercase tracking-[0.2em] font-mono relative z-10">Order Now</span>
                <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform duration-500 relative z-10" />
              </a>
            </div>

            {/* Star rating */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-white/40 fill-white/40" />)}
              </div>
              <span className="text-white/30 text-xs font-mono">5.0 / 5.0</span>
            </div>

            {/* Stores launched */}
            <div className="text-white/30 text-xs font-mono mb-8">60+ Stores Launched</div>
          </div>

          {/* Large product image */}
          <div className="border border-white/10 overflow-hidden group">
            <img
              src={template.image}
              alt={template.shortTitle}
              className="w-full aspect-[16/9] object-cover group-hover:scale-[1.02] transition-transform duration-1000"
            />
          </div>
        </div>
      </section>

      {/* ═══════════════ LIVE DEMO BUTTON ═══════════════ */}
      <section className="px-6 pb-16">
        <div className="max-w-[1200px] mx-auto text-center">
          <a
            href={template.orderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white/[0.04] border border-white/10 hover:border-white/30 transition-all duration-300 text-[10px] font-mono uppercase tracking-widest text-white/60 hover:text-white"
          >
            <Monitor className="w-4 h-4" /> Live Demo
          </a>
        </div>
      </section>

      {/* ═══════════════ DESCRIPTION ═══════════════ */}
      <section className="px-6 pb-20">
        <div className="max-w-[800px] mx-auto">
          <p className="text-white/50 text-lg leading-[1.8]">
            {template.longDescription}
          </p>
          <p className="text-white/40 text-base leading-[1.8] mt-6">
            You'll receive a modern {template.category === 'Shopify' ? 'Shopify store' : `${template.detailedFeatures.length > 5 ? template.detailedFeatures.length : 5}-page website`} customized for your industry. Every detail is built to spotlight your expertise, streamline customer engagement, and make it easy for visitors to take action. Whether you're launching a new venture or upgrading your digital presence, this template gives you everything you need to grow your business, delivered in just 7 days.
          </p>
        </div>
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <section className="px-6 pb-24">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-center mb-16">Features</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {template.detailedFeatures.map((feature) => (
              <GlareCard key={feature.name}>
                <div className="bg-white/[0.02] border border-white/5 p-8 h-full">
                  <div className="w-10 h-10 border border-white/10 flex items-center justify-center mb-5">
                    <Check className="w-5 h-5 text-white/40" />
                  </div>
                  <h3 className="text-base font-medium tracking-tight mb-3">{feature.name}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </GlareCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ PROCESS: PLUG & PLAY SYSTEM ═══════════════ */}
      <section className="px-6 py-24 bg-white/[0.02]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">
              Our proven plug and play<br />website design system
            </h2>
            <p className="text-white/40 max-w-xl mx-auto">
              We have built 1000+ websites and have a proven process to get your website live in 7-10 days. Don't pay inexperienced designers to learn on your project when we already have a proven process.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: 1, title: 'Place Order', desc: 'Select this template and complete your order. We send an onboarding form to collect your requirements.', timeline: '2 Days' },
              { step: 2, title: 'Share Logo and Colors', desc: 'Send us your logo, brand colors, copy, and images. We handle the rest of the design and build.', timeline: '3 Days' },
              { step: 3, title: 'Feedback + Revisions', desc: 'We build your site and share a preview link. You review and request adjustments. One round included.', timeline: '2 Days' },
              { step: 4, title: 'Go Live!', desc: 'Final approval, domain setup, and your site goes live. Full ownership handed to you.', timeline: '1 Day' },
            ].map((item) => (
              <div key={item.step} className="border border-white/10 p-6 relative">
                <div className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-4">Step {item.step}</div>
                <h3 className="text-lg font-medium tracking-tight mb-3">{item.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed mb-6">{item.desc}</p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/[0.04] border border-white/5 text-[9px] font-mono uppercase tracking-widest text-white/30">
                  <Clock className="w-3 h-3" /> Timeline {item.timeline}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ WHY CHOOSE US: COMPARISON TABLE ═══════════════ */}
      <section className="px-6 py-24">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">Why Choose Us</h2>
            <p className="text-white/40 max-w-lg mx-auto">See how we compare to traditional web design agencies and freelancers.</p>
          </div>

          <div className="max-w-3xl mx-auto overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 pr-6 text-white/40 font-mono text-[10px] uppercase tracking-widest w-1/3"></th>
                  <th className="text-left py-4 px-4 font-mono text-[10px] uppercase tracking-widest text-white/60 w-1/3">
                    <span className="flex items-center gap-2"><Shield className="w-3.5 h-3.5" /> GitSpark</span>
                  </th>
                  <th className="text-left py-4 pl-4 font-mono text-[10px] uppercase tracking-widest text-white/30 w-1/3">Others</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Turnaround time', us: '6 - 10 Days', others: '2 - 4 Months' },
                  { label: 'Total Cost', us: '1,499 AED', others: '20k - 50k' },
                  { label: 'Time commitment', us: '24 Hr SLA', others: '3 - 7 Days' },
                  { label: 'Conversion Optimised', us: 'Built For Conversion', others: 'Random Content' },
                  { label: 'Website Content', us: 'Done for you', others: 'You write it' },
                  { label: 'Site Loading Time', us: '< 1 Sec', others: '3 - 20 Sec' },
                  { label: 'Content Updation', us: 'Easily do it yourself', others: 'Need developer' },
                ].map((row) => (
                  <tr key={row.label} className="border-b border-white/5">
                    <td className="py-4 pr-6 text-white/40">{row.label}</td>
                    <td className="py-4 px-4">
                      <span className="flex items-center gap-2 text-white/80">
                        <Check className="w-4 h-4 text-white/50 shrink-0" /> {row.us}
                      </span>
                    </td>
                    <td className="py-4 pl-4 text-white/30">
                      <span className="flex items-center gap-2">
                        <Info className="w-4 h-4 text-white/20 shrink-0" /> {row.others}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═══════════════ PREVIEW IMAGES ═══════════════ */}
      {template.previewImages.length > 0 && (
        <section className="px-6 py-24 bg-white/[0.02]">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-center mb-16">Preview</h2>
            <PreviewGallery images={template.previewImages} labels={template.previewLabels} alt={template.shortTitle} />
          </div>
        </section>
      )}

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section className="px-6 py-24">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-center mb-16">Customers who love us</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Ravi CK', role: 'Business Owner', quote: 'Launching our new website has been a game-changer. The design is beautiful, and it\'s so much more user-friendly. Our customers love it.' },
              { name: 'Maya R.', role: 'Entrepreneur', quote: 'They built a stunning store that looks professional and is super easy to manage. My sales started picking up right after launch.' },
              { name: 'Rahul Sharma', role: 'Startup Founder', quote: 'The turnaround was incredible. From order to live in under a week. Quality rivals sites that cost 10x more.' },
            ].map((review) => (
              <div key={review.name} className="border border-white/10 p-8">
                <p className="text-white/50 text-sm leading-relaxed mb-6 italic">"{review.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-white/10 flex items-center justify-center text-[10px] font-mono text-white/30">
                    {review.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex gap-0.5 mb-1">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-white/30 fill-white/30" />)}
                    </div>
                    <p className="text-xs font-medium">{review.name}</p>
                    <p className="text-[10px] text-white/30 font-mono">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <section className="px-6 py-24 bg-white/[0.02]">
        <div className="max-w-[800px] mx-auto">
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-center mb-16">Answers to your questions</h2>
          {faqs.map((faq) => (
            <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
          <div className="border-t border-white/10" />
        </div>
      </section>

      {/* ═══════════════ ORDER CTA ═══════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30 mb-4">Ready-made websites to purchase!</p>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">
            Kickstart your online business instantly
          </h2>
          <p className="text-white/40 mb-10 max-w-lg mx-auto">
            Get the {template.shortTitle} template live in 7 days. One payment, full ownership, no surprises.
          </p>
          <a
            href={template.orderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-6 border border-white/20 px-10 py-6 hover:bg-white hover:text-black transition-all duration-500 relative overflow-hidden"
          >
            <span className="absolute inset-0 bg-white scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-mono relative z-10">Purchase Now</span>
            <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500 relative z-10" />
          </a>
        </div>
      </section>

      {/* ═══════════════ RECOMMENDED FOR YOU ═══════════════ */}
      {related.length > 0 && (
        <section className="py-24 px-6 bg-white/[0.02]">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-end justify-between gap-8 mb-4">
              <h2 className="text-2xl font-medium tracking-tight">Recommended For You</h2>
              <Link
                to="/templates"
                className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-mono text-white/40 hover:text-white transition-colors shrink-0"
              >
                See More <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
              </Link>
            </div>
            <p className="text-white/30 text-sm mb-12">Clear pricing. No fluff. Get a powerful site without breaking the bank.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-white/10 border border-white/10">
              {related.map((t) => (
                <GlareCard key={t.slug}>
                  <Link
                    to={`/templates/${t.slug}`}
                    className="group bg-onyx flex flex-col transition-colors relative block"
                  >
                    <div className="relative overflow-hidden aspect-[3/2]">
                      <img
                        src={t.image}
                        alt={t.shortTitle}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-onyx/60 to-transparent" />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-sm font-medium tracking-tight mb-2 group-hover:translate-x-1 transition-transform duration-300 leading-snug">
                        {t.shortTitle}
                      </h3>
                      <p className="text-white/30 text-[10px] font-mono mb-4 line-clamp-1">{t.description}</p>
                      <p className="text-lg font-medium tracking-tight">{t.price} <span className="text-xs text-white/40">{t.currency}</span></p>
                    </div>
                  </Link>
                </GlareCard>
              ))}
            </div>
          </div>
        </section>
      )}
    </motion.div>
  );
}
