import type { Metadata } from 'next';
import TemplatesClient from '../components/templates/TemplatesClient';
import { templates } from '@/src/data/templates';

export const metadata: Metadata = {
  title: 'Website Templates',
  description: 'Ready-made, high-performance website templates built to convert. Salon, e-commerce, Shopify stores, and more. Live in 7 days, starting at 1499 AED.',
  alternates: { canonical: 'https://muneer.architect/templates' },
  openGraph: {
    title: 'Website Templates',
    description: 'Ready-made, high-performance website templates built to convert. Salon, e-commerce, Shopify stores, and more.',
    url: 'https://muneer.architect/templates',
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Website Templates',
    description: 'Ready-made, high-performance website templates built to convert. Salon, e-commerce, Shopify stores, and more.',
    images: ['/og-default.png'],
  },
};

const SITE_URL = 'https://muneer.architect';

const templatesJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Website Templates — Muneer Puthiya Purayil',
  description: 'Ready-made, high-performance website templates built to convert.',
  url: `${SITE_URL}/templates`,
  mainEntity: {
    '@type': 'OfferCatalog',
    name: 'Website Templates',
    itemListElement: templates.map((t) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Product',
        name: t.title,
        url: `${SITE_URL}/templates/${t.slug}`,
        image: t.image,
      },
      price: t.price,
      priceCurrency: t.currency,
      availability: 'https://schema.org/InStock',
    })),
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Templates', item: `${SITE_URL}/templates` },
  ],
};

export default function TemplatesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(templatesJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <TemplatesClient />
    </>
  );
}
