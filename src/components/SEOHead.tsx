import { useEffect } from 'react';
import type { BlogSEO } from '../lib/blog';

interface SEOHeadProps {
  seo?: BlogSEO;
  jsonLd?: object | object[];
  // Fallback props for non-blog pages
  title?: string;
  description?: string;
}

/**
 * SEOHead — manages <head> meta tags and JSON-LD structured data.
 *
 * Since this is a client-side SPA (React + Vite), meta tags are injected
 * via DOM manipulation. For full SSR SEO, you'd move to Next.js or Astro.
 * This still provides value for:
 * - Social sharing (OG tags read by crawlers that execute JS)
 * - Google (renders JS and reads meta tags)
 * - JSON-LD structured data (Google reads this even in SPAs)
 * - Proper document.title
 */
export default function SEOHead({ seo, jsonLd, title, description }: SEOHeadProps) {
  useEffect(() => {
    const pageTitle = seo?.title || title || 'Muneer Puthiya Purayil | SaaS Architect & AI Systems Engineer';
    const pageDesc = seo?.description || description || 'Scalable Architecture. Agentic AI. Uncompromising Execution.';

    // Title
    document.title = pageTitle;

    // Helper to set/create meta tags
    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Basic meta
    setMeta('name', 'description', pageDesc);
    setMeta('name', 'author', seo?.author || 'Muneer Puthiya Purayil');

    // Robots
    if (seo?.noindex) {
      setMeta('name', 'robots', 'noindex, nofollow');
    } else {
      setMeta('name', 'robots', 'index, follow');
    }

    // Open Graph
    setMeta('property', 'og:title', pageTitle);
    setMeta('property', 'og:description', pageDesc);
    setMeta('property', 'og:type', seo?.ogType || 'website');
    setMeta('property', 'og:url', seo?.canonical || window.location.href);
    setMeta('property', 'og:site_name', 'Muneer Puthiya Purayil');
    setMeta('property', 'og:locale', 'en_US');

    if (seo?.ogImage) {
      setMeta('property', 'og:image', seo.ogImage);
      setMeta('property', 'og:image:width', '1200');
      setMeta('property', 'og:image:height', '630');
      if (seo.ogImageAlt) setMeta('property', 'og:image:alt', seo.ogImageAlt);
    }

    // Twitter Card
    setMeta('name', 'twitter:card', seo?.ogImage ? 'summary_large_image' : 'summary');
    setMeta('name', 'twitter:title', pageTitle);
    setMeta('name', 'twitter:description', pageDesc);
    if (seo?.ogImage) {
      setMeta('name', 'twitter:image', seo.ogImage);
    }

    // Article-specific
    if (seo?.ogType === 'article') {
      setMeta('property', 'article:published_time', seo.datePublished);
      if (seo.dateModified) setMeta('property', 'article:modified_time', seo.dateModified);
      setMeta('property', 'article:author', seo.author);
      setMeta('property', 'article:section', seo.category);
      seo.tags.forEach((tag, i) => {
        setMeta('property', `article:tag:${i}`, tag);
      });
    }

    // Canonical link
    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', seo?.canonical || window.location.href);

    // JSON-LD
    // Remove previous JSON-LD scripts we injected
    document.querySelectorAll('script[data-seo-jsonld]').forEach((el) => el.remove());

    const ldItems = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];
    ldItems.forEach((ld) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-jsonld', 'true');
      script.textContent = JSON.stringify(ld);
      document.head.appendChild(script);
    });

    // Cleanup on unmount
    return () => {
      document.querySelectorAll('script[data-seo-jsonld]').forEach((el) => el.remove());
    };
  }, [seo, jsonLd, title, description]);

  return null;
}
