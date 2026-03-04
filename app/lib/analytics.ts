// GA4 event tracking
// https://developers.google.com/analytics/devguides/collection/ga4/reference/events

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function event(name: string, params?: Record<string, string | number | boolean>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, params);
  }
}

// --- CTA Events ---

export function trackCTAClick(ctaType: 'calendly' | 'intake_form' | 'email', location: string) {
  event('cta_click', { cta_type: ctaType, location });
}

// --- Form Events ---

export function trackFormStart() {
  event('form_start', { form_name: 'intake' });
}

export function trackFormSubmit(scope?: string, budget?: string) {
  event('generate_lead', { form_name: 'intake', scope: scope || '', budget: budget || '' });
}

export function trackFormError(error: string) {
  event('form_error', { form_name: 'intake', error_message: error });
}

// --- Blog Events ---

export function trackBlogView(slug: string, category: string, readTime: string) {
  event('blog_view', { slug, category, read_time: readTime });
}

export function trackBlogScrollDepth(slug: string, depth: number) {
  event('scroll_depth', { slug, depth_percent: depth });
}

export function trackBlogShare(slug: string, method: string) {
  event('share', { content_type: 'blog', item_id: slug, method });
}

export function trackFAQOpen(slug: string, question: string) {
  event('faq_open', { slug, question });
}

// --- Template Events ---

export function trackTemplateView(slug: string, name: string) {
  event('view_item', { item_id: slug, item_name: name, item_category: 'template' });
}

export function trackTemplateOrder(slug: string, name: string) {
  event('begin_checkout', { item_id: slug, item_name: name, item_category: 'template', value: 1499, currency: 'AED' });
}

// --- Navigation Events ---

export function trackExternalLink(url: string, label: string) {
  event('outbound_click', { url, link_text: label });
}
