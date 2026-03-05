import type { Metadata } from 'next';
import './globals.css';
import Nav from './components/Nav';
import IntakeSection from './components/IntakeSection';
import Footer from './components/Footer';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const SITE_URL = 'https://mpurayil.com';
const DEFAULT_AUTHOR = 'Muneer Puthiya Purayil';
const description = 'SaaS architect and AI systems engineer with 10+ years shipping production infrastructure. Focused on scalable architecture, agentic AI, and enterprise mobile.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Muneer Puthiya Purayil | SaaS Architect & AI Systems Engineer',
    template: '%s — Muneer Puthiya Purayil',
  },
  description,
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Muneer Puthiya Purayil',
    title: 'Muneer Puthiya Purayil | SaaS Architect & AI Systems Engineer',
    description,
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Muneer Puthiya Purayil — SaaS Architect & AI Systems Engineer' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Muneer Puthiya Purayil | SaaS Architect & AI Systems Engineer',
    description,
    images: ['/og-default.png'],
  },
  alternates: {
    canonical: SITE_URL,
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const siteJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/#person`,
        name: DEFAULT_AUTHOR,
        url: SITE_URL,
        jobTitle: 'SaaS Architect & AI Systems Engineer',
        description: '10+ years shipping production infrastructure — from $4B automotive platforms to sub-0.1% crash-rate banking systems. Specializing in SaaS architecture, agentic AI systems, and enterprise mobile.',
        knowsAbout: [
          'Software Architecture',
          'Agentic AI',
          'SaaS Platforms',
          'React Native',
          'Microservices',
          'Multi-Tenant Architecture',
          'Cloud Infrastructure',
          'CI/CD Pipelines',
          'Performance Engineering',
          'TypeScript',
          'Node.js',
          'React',
          'Kubernetes',
        ],
        hasOccupation: {
          '@type': 'Occupation',
          name: 'SaaS Architect',
          occupationalCategory: '15-1252.00',
          skills: 'Software Architecture, System Design, Cloud Infrastructure, AI/ML Integration',
        },
        alumniOf: {
          '@type': 'EducationalOrganization',
          name: 'Calicut University',
        },
        sameAs: [
          'https://linkedin.com/in/muneer-p-5052b6128',
          'https://github.com/muneerpp3333',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'Muneer Puthiya Purayil',
        description: 'Scalable Architecture. Agentic AI. Uncompromising Execution.',
        publisher: { '@id': `${SITE_URL}/#person` },
        inLanguage: 'en-US',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'ProfessionalService',
        '@id': `${SITE_URL}/#business`,
        name: 'Muneer Puthiya Purayil — Architecture & Engineering',
        url: SITE_URL,
        description: 'SaaS architecture, agentic AI systems, and production-grade website templates. Based in Dubai, serving clients globally.',
        founder: { '@id': `${SITE_URL}/#person` },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Dubai',
          addressCountry: 'AE',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 25.2048,
          longitude: 55.2708,
        },
        areaServed: [
          { '@type': 'Country', name: 'United Arab Emirates' },
          { '@type': 'Country', name: 'India' },
          { '@type': 'Place', name: 'Worldwide (Remote)' },
        ],
        serviceType: [
          'SaaS Architecture',
          'Agentic AI Systems',
          'Website Templates',
          'Mobile App Development',
        ],
        priceRange: '$$',
        sameAs: [
          'https://linkedin.com/in/muneer-p-5052b6128',
          'https://github.com/muneerpp3333',
        ],
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        {GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}');`,
              }}
            />
          </>
        )}
        <script src="https://analytics.ahrefs.com/analytics.js" data-key="UgCFupZ5Fk343+dy/kooDQ" async />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-onyx text-white font-sans selection:bg-white selection:text-black">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        <Nav />
        <main>{children}</main>
        <IntakeSection />
        <Footer />
      </body>
    </html>
  );
}
