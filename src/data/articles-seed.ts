// ── Expansion Axes ──────────────────────────────────────────────────────────

export const techAxes = ['typescript', 'python', 'go', 'rust', 'java'] as const;
export const cloudAxes = ['aws', 'gcp', 'azure'] as const;
export const frameworkAxes = ['nestjs', 'nextjs', 'react', 'fastapi', 'spring-boot'] as const;
export const scaleAxes = ['startup', 'enterprise', 'high-scale'] as const;

export type TechAxis = (typeof techAxes)[number];
export type CloudAxis = (typeof cloudAxes)[number];
export type FrameworkAxis = (typeof frameworkAxes)[number];
export type ScaleAxis = (typeof scaleAxes)[number];

// ── Article Types ───────────────────────────────────────────────────────────

export interface ArticleType {
  type: 'guide' | 'comparison' | 'tutorial' | 'best-practices' | 'case-study';
  titlePattern: string;
  slugPattern: string;
  sections: string[];
  excerptTemplate: string;
  faqCount: number;
  readTimeRange: [number, number];
}

export const articleTypes: Record<ArticleType['type'], ArticleType> = {
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
      'FAQ',
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
      'FAQ',
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
      'FAQ',
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
      'FAQ',
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
      'FAQ',
    ],
    excerptTemplate:
      'Real-world lessons from implementing {topic} in production, including architecture decisions, measurable results, and honest retrospectives.',
    faqCount: 3,
    readTimeRange: [8, 14],
  },
};

// ── Seed Topics ─────────────────────────────────────────────────────────────

export type ClusterCategory =
  | 'AI Architecture'
  | 'SaaS Engineering'
  | 'System Design'
  | 'DevOps'
  | 'Mobile/Frontend';

export interface SeedTopic {
  baseTopic: string;
  title: string;
  category: ClusterCategory;
  baseTags: string[];
  validAxes: {
    tech: TechAxis[];
    cloud: CloudAxis[];
    framework: FrameworkAxis[];
    articleTypes: ArticleType['type'][];
    scale: ScaleAxis[];
  };
}

export const seedTopics: SeedTopic[] = [
  // ── AI Architecture ─────────────────────────────────────────────────────
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

  // ── SaaS Engineering ────────────────────────────────────────────────────
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

  // ── System Design ───────────────────────────────────────────────────────
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

  // ── DevOps ──────────────────────────────────────────────────────────────
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

  // ── Mobile/Frontend ─────────────────────────────────────────────────────
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
