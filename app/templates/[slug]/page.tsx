import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { templates, getTemplateBySlug, getRelatedTemplates } from '@/src/data/templates';
import TemplateDetailClient from '../../components/templates/TemplateDetailClient';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return templates.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const template = getTemplateBySlug(slug);
  if (!template) return {};
  return {
    title: `${template.shortTitle} | Website Templates`,
    description: template.description,
    alternates: { canonical: `https://mpurayil.com/templates/${slug}` },
    openGraph: {
      title: `${template.shortTitle} | Website Templates`,
      description: template.description,
      images: template.image ? [{ url: template.image }] : undefined,
    },
  };
}

export default async function TemplateDetailPage({ params }: Props) {
  const { slug } = await params;
  const template = getTemplateBySlug(slug);
  if (!template) notFound();

  const related = getRelatedTemplates(template.slug, 4);
  const SITE_URL = 'https://mpurayil.com';

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

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Templates', item: `${SITE_URL}/templates` },
      { '@type': 'ListItem', position: 3, name: template.shortTitle, item: `${SITE_URL}/templates/${template.slug}` },
    ],
  };

  const faqs = [
    { question: 'What is included in the ready-made website package?', answer: `You receive a fully designed and developed ${template.category === 'Shopify' ? 'Shopify store' : 'website'} with ${template.detailedFeatures.length} core features, mobile-responsive design, SEO optimization, and all content populated. Images and copy are customized to your brand.` },
    { question: 'How long does it take to set up the website?', answer: 'Your website is delivered within 7 business days from the date we receive your brand assets (logo, colors, content). The process is streamlined: order, share assets, review, and go live.' },
    { question: 'Can I customize the website design?', answer: 'Yes. Colors, fonts, images, and copy are all customizable during the review phase. You get one round of revisions included. The overall layout and structure follow the proven template design.' },
    { question: 'Do you offer support after the website is live?', answer: 'Yes. We offer ongoing support packages for content updates, feature additions, and technical maintenance. The website also comes with an easy-to-use CMS so you can make basic changes yourself.' },
    { question: 'Is hosting included with the website package?', answer: `${template.category === 'Shopify' ? 'Shopify hosting is included in your Shopify subscription (separate from the template price).' : 'Hosting setup guidance is included. We recommend reliable providers and can configure hosting for you at no extra cost.'} Domain registration is handled separately.` },
    { question: 'How do I manage the content on my website?', answer: 'The website comes with an easy-to-use content management system. You can update text, images, products, and pages yourself without any technical skills. For structural changes, our team is available.' },
  ];

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <TemplateDetailClient template={template} related={related} />
    </>
  );
}
