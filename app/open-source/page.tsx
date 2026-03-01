import type { Metadata } from 'next';
import OpenSourceClient from '../components/OpenSourceClient';

export const metadata: Metadata = {
  title: 'Open Source',
  description:
    'Patterns extracted from production systems. Open-sourced TypeScript libraries for mobile app generation, SaaS architecture, and enterprise engineering.',
  alternates: { canonical: 'https://muneer.architect/open-source' },
  openGraph: {
    title: 'Open Source',
    description: 'Patterns extracted from production systems. Open-sourced TypeScript libraries for mobile app generation, SaaS architecture, and enterprise engineering.',
    url: 'https://muneer.architect/open-source',
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Open Source',
    description: 'Patterns extracted from production systems. Open-sourced TypeScript libraries for mobile app generation, SaaS architecture, and enterprise engineering.',
    images: ['/og-default.png'],
  },
};

const SITE_URL = 'https://muneer.architect';

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Open Source', item: `${SITE_URL}/open-source` },
  ],
};

export default function OpenSourcePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <OpenSourceClient />
    </>
  );
}
