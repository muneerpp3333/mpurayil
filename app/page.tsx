import type { Metadata } from 'next';
import HomeClient from './components/home/HomeClient';
import { getAllPosts } from './lib/blog';
import { getFeaturedTemplates } from '@/src/data/templates';

export const metadata: Metadata = {
  title: 'Muneer Puthiya Purayil | SaaS Architect & AI Systems Engineer',
  description:
    'SaaS architect and AI systems engineer with 10+ years shipping production infrastructure. Focused on scalable architecture, agentic AI, and enterprise mobile.',
  alternates: { canonical: 'https://muneer.architect' },
};

export default function HomePage() {
  const posts = getAllPosts().slice(0, 3);
  const featuredTemplates = getFeaturedTemplates(3);
  return <HomeClient posts={posts} featuredTemplates={featuredTemplates} />;
}
