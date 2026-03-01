/**
 * generate-articles.mjs
 * Generates ~550 SEO blog post markdown files from seed topic data.
 * Usage: node scripts/generate-articles.mjs
 */

import { writeFile, mkdir, readdir } from 'fs/promises';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');
const BLOG_DIR = join(ROOT, 'content', 'blog');

// ── Axes ────────────────────────────────────────────────────────────────────

const techAxes = ['typescript', 'python', 'go', 'rust', 'java'];
const cloudAxes = ['aws', 'gcp', 'azure'];
const frameworkAxes = ['nestjs', 'nextjs', 'react', 'fastapi', 'spring-boot'];
const scaleAxes = ['startup', 'enterprise', 'high-scale'];

// ── Article Type Templates ──────────────────────────────────────────────────

const articleTypes = {
  guide: {
    type: 'guide',
    titlePattern: 'Complete Guide to {topic} with {tech}',
    slugPattern: '{base}-guide-{tech}',
    sections: [
      'Introduction',
      'Core Concepts',
      'Architecture Overview',
      'Implementation Steps',
      'Code Examples',
      'Performance Considerations',
      'Testing Strategy',
    ],
    excerptTemplate:
      'A comprehensive guide to implementing {topic} using {tech}, covering architecture, code examples, and production-ready patterns.',
    faqCount: 5,
    readTimeRange: [12, 20],
  },
  comparison: {
    type: 'comparison',
    titlePattern: '{topic}: {tech} vs {alt} in {year}',
    slugPattern: '{base}-{tech}-vs-{alt}-{year}',
    sections: [
      'Introduction',
      'Feature Comparison',
      'Performance Benchmarks',
      'Developer Experience',
      'Cost Analysis',
      'When to Choose Each',
      'Migration Considerations',
    ],
    excerptTemplate:
      'An in-depth comparison of {tech} and {alt} for {topic}, with benchmarks, cost analysis, and practical guidance for choosing the right tool.',
    faqCount: 4,
    readTimeRange: [10, 16],
  },
  tutorial: {
    type: 'tutorial',
    titlePattern: 'How to Build {topic} Using {framework}',
    slugPattern: '{base}-tutorial-{framework}',
    sections: [
      'Prerequisites',
      'Project Setup',
      'Core Implementation',
      'Adding Features',
      'Error Handling',
      'Deployment',
      'Next Steps',
    ],
    excerptTemplate:
      'Step-by-step tutorial for building {topic} with {framework}, from project setup through deployment.',
    faqCount: 3,
    readTimeRange: [15, 25],
  },
  'best-practices': {
    type: 'best-practices',
    titlePattern: '{topic} Best Practices for {scale} Teams',
    slugPattern: '{base}-best-practices-{scale}',
    sections: [
      'Introduction',
      'Common Anti-Patterns',
      'Architecture Principles',
      'Implementation Guidelines',
      'Monitoring & Alerts',
      'Team Workflow',
      'Checklist',
    ],
    excerptTemplate:
      'Battle-tested best practices for {topic} tailored to {scale} teams, including anti-patterns to avoid and a ready-to-use checklist.',
    faqCount: 4,
    readTimeRange: [10, 18],
  },
  'case-study': {
    type: 'case-study',
    titlePattern: '{topic} at Scale: Lessons from Production',
    slugPattern: '{base}-case-study',
    sections: [
      'The Challenge',
      'Architecture Decision',
      'Implementation',
      'Results & Metrics',
      'Lessons Learned',
      "What We'd Do Differently",
    ],
    excerptTemplate:
      'Real-world lessons from implementing {topic} in production, including architecture decisions, measurable results, and honest retrospectives.',
    faqCount: 3,
    readTimeRange: [8, 14],
  },
};

// ── Seed Topics ─────────────────────────────────────────────────────────────

const seedTopics = [
  // AI Architecture
  {
    baseTopic: 'agentic-ai-workflows',
    title: 'Agentic AI Workflows',
    category: 'AI Architecture',
    baseTags: ['agentic-ai', 'llm', 'workflows', 'orchestration'],
    validAxes: {
      tech: ['typescript', 'python'],
      cloud: ['aws', 'gcp', 'azure'],
      framework: ['nestjs', 'fastapi'],
      articleTypes: ['guide', 'tutorial', 'best-practices', 'case-study'],
      scale: ['startup', 'enterprise', 'high-scale'],
    },
  },
  {
    baseTopic: 'rag-pipeline-design',
    title: 'RAG Pipeline Design',
    category: 'AI Architecture',
    baseTags: ['rag', 'vector-search', 'embeddings', 'llm'],
    validAxes: {
      tech: ['typescript', 'python'],
      cloud: ['aws', 'gcp', 'azure'],
      framework: ['fastapi', 'nestjs'],
      articleTypes: ['guide', 'tutorial', 'comparison', 'best-practices'],
      scale: ['startup', 'enterprise', 'high-scale'],
    },
  },
  {
    baseTopic: 'llm-fine-tuning-production',
    title: 'LLM Fine-Tuning Production',
    category: 'AI Architecture',
    baseTags: ['llm', 'fine-tuning', 'mlops', 'training'],
    validAxes: {
      tech: ['python', 'typescript'],
      cloud: ['aws', 'gcp', 'azure'],
      framework: ['fastapi'],
      articleTypes: ['guide', 'tutorial', 'best-practices', 'case-study'],
      scale: ['startup', 'enterprise', 'high-scale'],
    },
  },
  {
    baseTopic: 'vector-database-architecture',
    title: 'Vector Database Architecture',
    category: 'AI Architecture',
    baseTags: ['vector-db', 'embeddings', 'similarity-search', 'ai-infrastructure'],
    validAxes: {
      tech: ['typescript', 'python', 'go', 'rust'],
      cloud: ['aws', 'gcp', 'azure'],
      framework: ['nestjs', 'fastapi'],
      articleTypes: ['guide', 'comparison', 'best-practices', 'case-study'],
      scale: ['startup', 'enterprise', 'high-scale'],
    },
  },
  {
    baseTopic: 'ai-guardrails-safety',
    title: 'AI Guardrails & Safety',
    category: 'AI Architecture',
    baseTags: ['ai-safety', 'guardrails', 'responsible-ai', 'llm'],
    validAxes: {
      tech: ['typescript', 'python'],
      cloud: ['aws', 'gcp', 'azure'],
      framework: ['nestjs', 'fastapi'],
      articleTypes: ['guide', 'best-practices', 'case-study'],
      scale: ['startup', 'enterprise'],
    },
  },
  // SaaS Engineering
  {
    baseTopic: 'multi-tenant-architecture',
    title: 'Multi-Tenant Architecture',
    category: 'SaaS Engineering',
    baseTags: ['multi-tenancy', 'saas', 'architecture', 'isolation'],
    validAxes: {
      tech: ['typescript', 'python', 'go', 'java'],
      cloud: ['aws', 'gcp', 'azure'],
      framework: ['nestjs', 'nextjs', 'fastapi', 'spring-boot'],
      articleTypes: ['guide', 'comparison', 'best-practices', 'case-study'],
      scale: ['startup', 'enterprise', 'high-scale'],
    },
  },
  {
    baseTopic: 'subscription-billing-systems',
    title: 'Subscription Billing Systems',
    category: 'SaaS Engineering',
    baseTags: ['billing', 'stripe', 'subscriptions', 'saas'],
    validAxes: {
      tech: ['typescript', 'python', 'go'],
      cloud: ['aws', 'gcp', 'azure'],
      framework: ['nestjs', 'nextjs', 'fastapi'],
      articleTypes: ['guide', 'tutorial', 'best-practices'],
      scale: ['startup', 'enterprise'],
    },
  },
  {
    baseTopic: 'saas-api-design',
    title: 'SaaS API Design',
    category: 'SaaS Engineering',
    baseTags: ['api-design', 'rest', 'graphql', 'saas'],
    validAxes: {
      tech: ['typescript', 'python', 'go', 'java'],
      cloud: ['aws', 'gcp', 'azure'],
      framework: ['nestjs', 'fastapi', 'spring-boot'],
      articleTypes: ['guide', 'comparison', 'best-practices', 'tutorial'],
      scale: ['startup', 'enterprise', 'high-scale'],
    },
  },
  {
    baseTopic: 'feature-flag-architecture',
    title: 'Feature Flag Architecture',
    category: 'SaaS Engineering',
    baseTags: ['feature-flags', 'progressive-rollout', 'experimentation', 'saas'],
    validAxes: {
      tech: ['typescript', 'python', 'go', 'java'],
      cloud: ['aws', 'gcp', 'azure'],
      framework: ['nestjs', 'nextjs', 'react', 'spring-boot'],
      articleTypes: ['guide', 'tutorial', 'best-practices', 'comparison'],
      scale: ['startup', 'enterprise'],
    },
  },
  {
    baseTopic: 'saas-onboarding-flows',
    title: 'SaaS Onboarding Flows',
    category: 'SaaS Engineering',
    baseTags: ['onboarding', 'user-experience', 'activation', 'saas'],
    validAxes: {
      tech: ['typescript'],
      cloud: ['aws', 'gcp', 'azure'],
      framework: ['nextjs', 'react'],
      articleTypes: ['guide', 'tutorial', 'best-practices', 'case-study'],
      scale: ['startup', 'enterprise'],
    },
  },
  // System Design
  {
    baseTopic: 'event-driven-architecture',
    title: 'Event-Driven Architecture',
    category: 'System Design',
    baseTags: ['event-driven', 'messaging', 'kafka', 'architecture'],
    validAxes: {
      tech: ['typescript', 'python', 'go', 'java', 'rust'],
      cloud: ['aws', 'gcp', 'azure'],
      framework: ['nestjs', 'fastapi', 'spring-boot'],
      articleTypes: ['guide', 'comparison', 'best-practices', 'case-study'],
      scale: ['startup', 'enterprise', 'high-scale'],
    },
  },
  {
    baseTopic: 'cqrs-event-sourcing',
    title: 'CQRS & Event Sourcing',
    category: 'System Design',
    baseTags: ['cqrs', 'event-sourcing', 'ddd', 'architecture'],
    validAxes: {
      tech: ['typescript', 'java', 'go'],
      cloud: ['aws', 'gcp', 'azure'],
      framework: ['nestjs', 'spring-boot'],
      articleTypes: ['guide', 'tutorial', 'best-practices', 'case-study'],
      scale: ['enterprise', 'high-scale'],
    },
  },
  {
    baseTopic: 'distributed-caching',
    title: 'Distributed Caching',
    category: 'System Design',
    baseTags: ['caching', 'redis', 'performance', 'distributed-systems'],
    validAxes: {
      tech: ['typescript', 'python', 'go', 'java', 'rust'],
      cloud: ['aws', 'gcp', 'azure'],
      framework: ['nestjs', 'fastapi', 'spring-boot'],
      articleTypes: ['guide', 'comparison', 'best-practices', 'tutorial'],
      scale: ['startup', 'enterprise', 'high-scale'],
    },
  },
  {
    baseTopic: 'database-sharding',
    title: 'Database Sharding',
    category: 'System Design',
    baseTags: ['sharding', 'database', 'scalability', 'distributed-systems'],
    validAxes: {
      tech: ['typescript', 'python', 'go', 'java'],
      cloud: ['aws', 'gcp', 'azure'],
      framework: ['nestjs', 'fastapi', 'spring-boot'],
      articleTypes: ['guide', 'best-practices', 'case-study'],
      scale: ['enterprise', 'high-scale'],
    },
  },
  {
    baseTopic: 'saga-pattern',
    title: 'Saga Pattern Implementation',
    category: 'System Design',
    baseTags: ['saga', 'distributed-transactions', 'microservices', 'orchestration'],
    validAxes: {
      tech: ['typescript', 'java', 'go'],
      cloud: ['aws', 'gcp', 'azure'],
      framework: ['nestjs', 'spring-boot'],
      articleTypes: ['guide', 'tutorial', 'best-practices', 'case-study'],
      scale: ['enterprise', 'high-scale'],
    },
  },
  // DevOps
  {
    baseTopic: 'kubernetes-production',
    title: 'Kubernetes Production Setup',
    category: 'DevOps',
    baseTags: ['kubernetes', 'k8s', 'container-orchestration', 'devops'],
    validAxes: {
      tech: ['typescript', 'python', 'go', 'rust', 'java'],
      cloud: ['aws', 'gcp', 'azure'],
      framework: [],
      articleTypes: ['guide', 'best-practices', 'tutorial', 'case-study'],
      scale: ['startup', 'enterprise', 'high-scale'],
    },
  },
  {
    baseTopic: 'ci-cd-pipeline-design',
    title: 'CI/CD Pipeline Design',
    category: 'DevOps',
    baseTags: ['ci-cd', 'automation', 'github-actions', 'devops'],
    validAxes: {
      tech: ['typescript', 'python', 'go', 'rust', 'java'],
      cloud: ['aws', 'gcp', 'azure'],
      framework: [],
      articleTypes: ['guide', 'tutorial', 'best-practices', 'comparison'],
      scale: ['startup', 'enterprise', 'high-scale'],
    },
  },
  {
    baseTopic: 'infrastructure-as-code',
    title: 'Infrastructure as Code',
    category: 'DevOps',
    baseTags: ['iac', 'terraform', 'pulumi', 'devops'],
    validAxes: {
      tech: ['typescript', 'python', 'go'],
      cloud: ['aws', 'gcp', 'azure'],
      framework: [],
      articleTypes: ['guide', 'comparison', 'tutorial', 'best-practices'],
      scale: ['startup', 'enterprise', 'high-scale'],
    },
  },
  {
    baseTopic: 'monitoring-observability',
    title: 'Monitoring & Observability',
    category: 'DevOps',
    baseTags: ['monitoring', 'observability', 'logging', 'tracing'],
    validAxes: {
      tech: ['typescript', 'python', 'go', 'java', 'rust'],
      cloud: ['aws', 'gcp', 'azure'],
      framework: ['nestjs', 'fastapi', 'spring-boot'],
      articleTypes: ['guide', 'comparison', 'best-practices', 'case-study'],
      scale: ['startup', 'enterprise', 'high-scale'],
    },
  },
  {
    baseTopic: 'zero-downtime-deployments',
    title: 'Zero-Downtime Deployments',
    category: 'DevOps',
    baseTags: ['zero-downtime', 'blue-green', 'canary', 'deployment'],
    validAxes: {
      tech: ['typescript', 'python', 'go', 'java'],
      cloud: ['aws', 'gcp', 'azure'],
      framework: ['nestjs', 'fastapi', 'spring-boot'],
      articleTypes: ['guide', 'tutorial', 'best-practices', 'case-study'],
      scale: ['startup', 'enterprise', 'high-scale'],
    },
  },
  // Mobile/Frontend
  {
    baseTopic: 'react-native-performance',
    title: 'React Native Performance',
    category: 'Mobile/Frontend',
    baseTags: ['react-native', 'mobile', 'performance', 'optimization'],
    validAxes: {
      tech: ['typescript'],
      cloud: ['aws', 'gcp', 'azure'],
      framework: ['react'],
      articleTypes: ['guide', 'tutorial', 'best-practices', 'case-study'],
      scale: ['startup', 'enterprise'],
    },
  },
  {
    baseTopic: 'mobile-ci-cd',
    title: 'Mobile CI/CD Pipelines',
    category: 'Mobile/Frontend',
    baseTags: ['mobile', 'ci-cd', 'fastlane', 'app-distribution'],
    validAxes: {
      tech: ['typescript'],
      cloud: ['aws', 'gcp', 'azure'],
      framework: ['react'],
      articleTypes: ['guide', 'tutorial', 'best-practices', 'comparison'],
      scale: ['startup', 'enterprise'],
    },
  },
  {
    baseTopic: 'cross-platform-architecture',
    title: 'Cross-Platform Architecture',
    category: 'Mobile/Frontend',
    baseTags: ['cross-platform', 'mobile', 'architecture', 'code-sharing'],
    validAxes: {
      tech: ['typescript'],
      cloud: ['aws', 'gcp', 'azure'],
      framework: ['react', 'nextjs'],
      articleTypes: ['guide', 'comparison', 'best-practices', 'case-study'],
      scale: ['startup', 'enterprise'],
    },
  },
  {
    baseTopic: 'frontend-state-management',
    title: 'Frontend State Management',
    category: 'Mobile/Frontend',
    baseTags: ['state-management', 'redux', 'zustand', 'frontend'],
    validAxes: {
      tech: ['typescript'],
      cloud: [],
      framework: ['react', 'nextjs'],
      articleTypes: ['guide', 'comparison', 'tutorial', 'best-practices'],
      scale: ['startup', 'enterprise'],
    },
  },
  {
    baseTopic: 'progressive-web-apps',
    title: 'Progressive Web Apps',
    category: 'Mobile/Frontend',
    baseTags: ['pwa', 'service-workers', 'offline-first', 'web-performance'],
    validAxes: {
      tech: ['typescript'],
      cloud: ['aws', 'gcp', 'azure'],
      framework: ['react', 'nextjs'],
      articleTypes: ['guide', 'tutorial', 'best-practices', 'case-study'],
      scale: ['startup', 'enterprise'],
    },
  },
];

// ── Protected files (hand-written, never overwrite) ─────────────────────────

const PROTECTED_SLUGS = new Set([
  'scaling-to-4b-lessons-in-latency',
  'architecting-for-the-agentic-era',
  'multi-tenant-saas-playbook',
  'react-native-performance-at-enterprise-scale',
]);

// ── Helpers ─────────────────────────────────────────────────────────────────

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function titleCase(str) {
  return str
    .split(/[-_]/)
    .map((w) => capitalize(w))
    .join(' ');
}

function deterministicReadTime(min, max, index) {
  return min + (index % (max - min + 1));
}

function staggerDate(index, total) {
  const startMs = new Date('2024-09-01').getTime();
  const endMs = new Date('2026-02-28').getTime();
  const rangeMs = endMs - startMs;
  const offsetMs = Math.floor((rangeMs / total) * index);
  const d = new Date(startMs + offsetMs);
  return d.toISOString().slice(0, 10);
}

// ── Sub-section generators per section name ─────────────────────────────────

const subsectionMap = {
  Introduction: ['Why This Matters', 'Who This Is For', 'What You Will Learn'],
  'Core Concepts': ['Key Terminology', 'Mental Models', 'Foundational Principles'],
  'Architecture Overview': ['High-Level Design', 'Component Breakdown', 'Data Flow'],
  'Implementation Steps': ['Step 1: Project Setup', 'Step 2: Core Logic', 'Step 3: Integration'],
  'Code Examples': ['Basic Implementation', 'Advanced Patterns', 'Production Hardening'],
  'Performance Considerations': ['Latency Optimization', 'Memory Management', 'Load Testing'],
  'Testing Strategy': ['Unit Tests', 'Integration Tests', 'End-to-End Validation'],
  'Feature Comparison': ['Core Features', 'Ecosystem & Tooling', 'Community Support'],
  'Performance Benchmarks': ['Throughput Tests', 'Latency Profiles', 'Resource Utilization'],
  'Developer Experience': ['Setup & Onboarding', 'Debugging & Tooling', 'Documentation Quality'],
  'Cost Analysis': ['Licensing Costs', 'Infrastructure Requirements', 'Total Cost of Ownership'],
  'When to Choose Each': ['Best Fit Scenarios', 'Trade-Off Matrix'],
  'Migration Considerations': ['Migration Path', 'Risk Assessment', 'Rollback Strategy'],
  Prerequisites: ['Required Knowledge', 'Development Environment', 'Dependencies'],
  'Project Setup': ['Initialize Project', 'Configure Build Tools', 'Add Dependencies'],
  'Core Implementation': ['Building the Foundation', 'Adding Business Logic', 'Connecting Services'],
  'Adding Features': ['Feature 1: Core Capability', 'Feature 2: Extensions', 'Feature 3: Polish'],
  'Error Handling': ['Error Classification', 'Recovery Strategies', 'User-Facing Messages'],
  Deployment: ['Environment Configuration', 'CI/CD Pipeline', 'Monitoring Setup'],
  'Next Steps': ['Recommended Extensions', 'Further Reading'],
  'Common Anti-Patterns': ['Anti-Pattern 1: Over-Engineering', 'Anti-Pattern 2: Premature Optimization', 'Anti-Pattern 3: Ignoring Observability'],
  'Architecture Principles': ['Separation of Concerns', 'Scalability Patterns', 'Resilience Design'],
  'Implementation Guidelines': ['Coding Standards', 'Review Checklist', 'Documentation Requirements'],
  'Monitoring & Alerts': ['Key Metrics', 'Alert Thresholds', 'Dashboard Design'],
  'Team Workflow': ['Development Process', 'Code Review Standards', 'Incident Response'],
  Checklist: ['Pre-Launch Checklist', 'Post-Launch Validation'],
  'The Challenge': ['Business Context', 'Technical Constraints', 'Scale Requirements'],
  'Architecture Decision': ['Options Evaluated', 'Decision Criteria', 'Final Architecture'],
  Implementation: ['Phase 1: Foundation', 'Phase 2: Core Features', 'Phase 3: Optimization'],
  'Results & Metrics': ['Performance Gains', 'Cost Impact', 'Developer Productivity'],
  'Lessons Learned': ['What Worked', 'What Surprised Us', 'Key Takeaways'],
  "What We'd Do Differently": ['Architecture Changes', 'Process Improvements'],
};

// ── FAQ generator ───────────────────────────────────────────────────────────

function generateFaqSection(topic, tech, faqCount) {
  const techLabel = tech ? titleCase(tech) : 'modern tools';
  const questions = [
    {
      q: `What is ${topic.title} and why does it matter?`,
      a: `${topic.title} is a critical architectural pattern for modern software systems. It matters because it directly impacts scalability, maintainability, and team velocity in production environments.`,
    },
    {
      q: `How does ${techLabel} compare for ${topic.title}?`,
      a: `${techLabel} offers specific advantages for ${topic.title} including strong typing, ecosystem support, and production-grade tooling. The choice depends on your team's expertise and project requirements.`,
    },
    {
      q: `What are common mistakes with ${topic.title}?`,
      a: `Common mistakes include premature optimization, insufficient observability, ignoring failure modes, and over-engineering the initial implementation. Start simple and iterate based on production data.`,
    },
    {
      q: `How long does it take to implement ${topic.title}?`,
      a: `Implementation timelines vary significantly based on scale and complexity. A minimal viable implementation typically takes 2-4 weeks, while a production-grade system may require 2-3 months of iterative development.`,
    },
    {
      q: `What infrastructure do I need for ${topic.title}?`,
      a: `Infrastructure requirements depend on scale. At minimum, you need reliable compute, monitoring, and CI/CD. For production systems, add load balancing, auto-scaling, and comprehensive observability.`,
    },
    {
      q: `Can ${topic.title} work with microservices?`,
      a: `Yes, ${topic.title} integrates well with microservices architectures. Key considerations include service boundaries, inter-service communication patterns, and distributed tracing for debugging.`,
    },
  ];

  const selected = questions.slice(0, faqCount);
  let md = '\n## FAQ\n';
  for (const { q, a } of selected) {
    md += `\n### ${q}\n\n${a}\n`;
  }
  return md;
}

// ── Related links generator ─────────────────────────────────────────────────

function generateRelatedLinks(currentSlug, allArticles, topic) {
  const sameCluster = allArticles.filter(
    (a) => a.category === topic.category && a.slug !== currentSlug,
  );
  const picked = sameCluster.slice(0, 3);
  if (picked.length === 0) return '';

  let md = '\n## Related Reading\n\n';
  for (const a of picked) {
    md += `- [${a.title}](/blog/${a.slug})\n`;
  }
  return md;
}

// ── Section body generator ──────────────────────────────────────────────────

function generateSectionBody(sectionName, topic, tech) {
  const subs = subsectionMap[sectionName] || ['Overview', 'Details', 'Summary'];
  const techLabel = tech ? titleCase(tech) : 'your chosen stack';
  let md = '';

  for (const sub of subs) {
    md += `\n### ${sub}\n\n`;
    md += `<!-- CONTENT: Explain ${sub.toLowerCase()} for ${topic.title} in context of ${techLabel} -->\n\n`;
    if (
      sectionName === 'Code Examples' ||
      sectionName === 'Core Implementation' ||
      sectionName === 'Implementation Steps' ||
      sectionName === 'Implementation'
    ) {
      md += '```typescript\n// TODO: Add implementation example\n```\n\n';
    }
  }
  return md;
}

// ── Main generation logic ───────────────────────────────────────────────────

async function main() {
  await mkdir(BLOG_DIR, { recursive: true });

  const existingFiles = new Set(
    (await readdir(BLOG_DIR)).filter((f) => f.endsWith('.md')).map((f) => f.replace('.md', '')),
  );

  // First pass: build all article metadata for related links
  const allArticles = [];
  let globalIndex = 0;

  for (const topic of seedTopics) {
    const validTypes = topic.validAxes.articleTypes;

    for (const artType of validTypes) {
      const template = articleTypes[artType];
      if (!template) continue;

      if (artType === 'guide') {
        for (const tech of topic.validAxes.tech) {
          const slug = slugify(template.slugPattern
            .replace('{base}', topic.baseTopic)
            .replace('{tech}', tech));
          const title = template.titlePattern
            .replace('{topic}', topic.title)
            .replace('{tech}', titleCase(tech));
          allArticles.push({ slug, title, category: topic.category, type: artType, tech, topic, globalIndex });
          globalIndex++;
        }
      } else if (artType === 'comparison') {
        const techs = topic.validAxes.tech;
        for (let i = 0; i < techs.length; i++) {
          for (let j = i + 1; j < techs.length; j++) {
            const slug = slugify(template.slugPattern
              .replace('{base}', topic.baseTopic)
              .replace('{tech}', techs[i])
              .replace('{alt}', techs[j])
              .replace('{year}', '2025'));
            const title = template.titlePattern
              .replace('{topic}', topic.title)
              .replace('{tech}', titleCase(techs[i]))
              .replace('{alt}', titleCase(techs[j]))
              .replace('{year}', '2025');
            allArticles.push({ slug, title, category: topic.category, type: artType, tech: techs[i], alt: techs[j], topic, globalIndex });
            globalIndex++;
          }
        }
      } else if (artType === 'tutorial') {
        for (const fw of topic.validAxes.framework) {
          const slug = slugify(template.slugPattern
            .replace('{base}', topic.baseTopic)
            .replace('{framework}', fw));
          const title = template.titlePattern
            .replace('{topic}', topic.title)
            .replace('{framework}', titleCase(fw));
          allArticles.push({ slug, title, category: topic.category, type: artType, tech: fw, topic, globalIndex });
          globalIndex++;
        }
      } else if (artType === 'best-practices') {
        for (const scale of topic.validAxes.scale) {
          const slug = slugify(template.slugPattern
            .replace('{base}', topic.baseTopic)
            .replace('{scale}', scale));
          const title = template.titlePattern
            .replace('{topic}', topic.title)
            .replace('{scale}', titleCase(scale));
          allArticles.push({ slug, title, category: topic.category, type: artType, tech: scale, topic, globalIndex });
          globalIndex++;
        }
      } else if (artType === 'case-study') {
        // One case study per topic (paired with first cloud axis for tag variety)
        const cloud = topic.validAxes.cloud[0] || 'aws';
        const slug = slugify(template.slugPattern.replace('{base}', topic.baseTopic));
        const title = template.titlePattern.replace('{topic}', topic.title);
        allArticles.push({ slug, title, category: topic.category, type: artType, tech: cloud, topic, globalIndex });
        globalIndex++;
      }
    }
  }

  // Deduplicate by slug
  const slugMap = new Map();
  for (const a of allArticles) {
    if (!slugMap.has(a.slug)) {
      slugMap.set(a.slug, a);
    }
  }
  const uniqueArticles = Array.from(slugMap.values());
  const totalCount = uniqueArticles.length;

  let generated = 0;
  let skipped = 0;

  // Second pass: generate files
  for (let i = 0; i < uniqueArticles.length; i++) {
    const article = uniqueArticles[i];
    const { slug, title, type: artType, tech, alt, topic } = article;

    // Skip protected files
    if (PROTECTED_SLUGS.has(slug)) {
      skipped++;
      continue;
    }

    // Skip existing files
    if (existingFiles.has(slug)) {
      skipped++;
      continue;
    }

    const template = articleTypes[artType];
    const date = staggerDate(i, totalCount);
    const readTime = deterministicReadTime(template.readTimeRange[0], template.readTimeRange[1], i);

    // Build tags
    const tags = [...topic.baseTags];
    if (tech && !tags.includes(tech)) {
      tags.push(tech);
    }
    tags.push(artType);

    // Build excerpt
    const excerpt = template.excerptTemplate
      .replace(/{topic}/g, topic.title)
      .replace(/{tech}/g, titleCase(tech || 'modern tools'))
      .replace(/{alt}/g, alt ? titleCase(alt) : '')
      .replace(/{framework}/g, titleCase(tech || 'modern tools'))
      .replace(/{scale}/g, titleCase(tech || 'growing'))
      .replace(/\s+/g, ' ')
      .trim();

    // Build frontmatter
    const frontmatter = [
      '---',
      `title: "${title}"`,
      `slug: ${slug}`,
      `date: ${date}`,
      `excerpt: "${excerpt}"`,
      `category: ${topic.category}`,
      `tags: [${tags.map((t) => `"${t}"`).join(', ')}]`,
      `readTime: ${readTime} min read`,
      `status: published`,
      `sources: []`,
      '---',
    ].join('\n');

    // Build body sections
    let body = '';
    for (const section of template.sections) {
      body += `\n## ${section}\n`;
      body += generateSectionBody(section, topic, tech);
    }

    // Add FAQ
    body += generateFaqSection(topic, tech, template.faqCount);

    // Add related links
    body += generateRelatedLinks(slug, uniqueArticles, topic);

    // Write file
    const content = frontmatter + '\n' + body;
    await writeFile(join(BLOG_DIR, `${slug}.md`), content, 'utf-8');
    generated++;
  }

  console.log(`\n  Article Generation Complete`);
  console.log(`  ─────────────────────────`);
  console.log(`  Generated: ${generated}`);
  console.log(`  Skipped:   ${skipped}`);
  console.log(`  Total:     ${totalCount} unique combinations\n`);
}

main().catch((err) => {
  console.error('Generation failed:', err);
  process.exit(1);
});
