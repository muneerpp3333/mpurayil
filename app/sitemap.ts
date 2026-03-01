import type { MetadataRoute } from 'next';
import { getAllPosts } from './lib/blog';
import { templates } from '@/src/data/templates';

export const dynamic = 'force-static';

const SITE_URL = 'https://muneer.architect';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date().toISOString(), changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/portfolio`, lastModified: new Date().toISOString(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/templates`, lastModified: new Date().toISOString(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/open-source`, lastModified: new Date().toISOString(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/blog`, lastModified: new Date().toISOString(), changeFrequency: 'daily', priority: 0.9 },
  ];

  const templatePages: MetadataRoute.Sitemap = templates.map((t) => ({
    url: `${SITE_URL}/templates/${t.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updated || post.date,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...templatePages, ...blogPages];
}
