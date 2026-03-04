import type { Metadata } from 'next';
import PortfolioClient from '../components/PortfolioClient';

export const metadata: Metadata = {
  title: 'Portfolio',
  description:
    'Architecture decisions and their measurable outcomes across fintech, automotive, e-commerce, and healthcare. $4B platforms, sub-0.1% crash rates, 300% efficiency gains.',
  alternates: { canonical: 'https://mpurayil.com/portfolio' },
  openGraph: {
    title: 'Portfolio',
    description: 'Architecture decisions and their measurable outcomes across fintech, automotive, e-commerce, and healthcare.',
    url: 'https://mpurayil.com/portfolio',
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio',
    description: 'Architecture decisions and their measurable outcomes across fintech, automotive, e-commerce, and healthcare.',
    images: ['/og-default.png'],
  },
};

const caseStudies = [
  {
    title: 'Global Checkout Pipeline',
    company: 'Tekion Corp',
    year: '2018-2020',
    description:
      "Re-engineered the global checkout system for automotive dealerships. Reduced latency, improved transaction reliability across high-stakes B2B2C flows. Worked with founding engineers during the platform's scale to $4B valuation.",
  },
  {
    title: 'Intelligent Push Engine & Mobile Commerce',
    company: 'FragranceNet.com',
    year: '2022-Present',
    description:
      'Behavioral segmentation engine with real-time triggers that drove 30% sales uplift. NestJS microservices migration. OTA pipeline cutting deploy time by 50%. Mobile infrastructure behind 500k+ downloads.',
  },
  {
    title: 'Platform Performance Engineering',
    company: 'Sonder Inc',
    year: '2021-2022',
    description:
      'Guest check-in performance overhaul: optimized network payloads, lazy-loaded assets, refined critical rendering paths. JS-to-TypeScript migration across core modules. Automated testing framework that stabilized deployments.',
  },
  {
    title: 'Mission-Critical Banking Onboarding',
    company: 'Mashreq Digital Bank',
    year: '2020-2021',
    description:
      'Regulated-grade onboarding system deployed across 50+ bank branches. Sub-0.1% crash rate in a zero-tolerance financial environment. iOS and Android.',
  },
  {
    title: 'Telehealth Ecosystem, Zero to Launch',
    company: 'mfine',
    year: '2017-2018',
    description:
      'Doctor-facing telehealth MVP shipped in under 6 months. Patient interaction flows and appointment systems. 4.8/5 app rating. 60% partner acquisition boost.',
  },
  {
    title: 'No-Code Mobile App Builder for Shopify',
    company: 'Appify.it',
    year: 'Side Project',
    description:
      'Multi-tenant SaaS platform where Shopify merchants build mobile apps via drag-and-drop. Kubernetes backend with ElasticSearch/Kibana observability. 500+ active merchants.',
  },
];

const portfolioJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Portfolio | Muneer Puthiya Purayil',
  description:
    'Architecture decisions and their measurable outcomes across fintech, automotive, e-commerce, and healthcare.',
  url: 'https://mpurayil.com/portfolio',
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: caseStudies.map((cs, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: cs.title,
      description: cs.description,
    })),
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://mpurayil.com' },
    { '@type': 'ListItem', position: 2, name: 'Portfolio', item: 'https://mpurayil.com/portfolio' },
  ],
};

export default function PortfolioPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PortfolioClient />
    </>
  );
}
