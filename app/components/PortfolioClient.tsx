'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-4 mb-12">
    <div className="h-[1px] w-12 bg-white/20" />
    <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-white/40">{children}</span>
  </div>
);

const CaseStudy = ({ title, company, year, description, impact, tags }: any) => (
  <div className="group border-t border-white/10 py-24 grid lg:grid-cols-2 gap-16 items-start">
    <div>
      <div className="flex items-center gap-4 mb-6">
        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{company}</span>
        <span className="text-[10px] font-mono text-white/20">&bull;</span>
        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{year}</span>
      </div>
      <h2 className="text-4xl md:text-5xl font-medium mb-8 tracking-tight group-hover:translate-x-2 transition-transform duration-300">{title}</h2>
      <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-xl">
        {description}
      </p>
      <div className="flex flex-wrap gap-3">
        {tags.map((tag: string) => (
          <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-widest text-white/60">
            {tag}
          </span>
        ))}
      </div>
    </div>
    <div>
      <div className="grid grid-cols-2 gap-8 border-l border-white/10 pl-8">
        {impact.map((item: any, i: number) => (
          <div key={i} className="mb-8">
            <p className="text-3xl font-medium mb-1 tracking-tight">{item.value}</p>
            <p className="text-[10px] uppercase tracking-widest font-mono text-white/40">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default function PortfolioClient() {
  const caseStudies = [
    {
      title: "Global Checkout Pipeline",
      company: "Tekion Corp",
      year: "2018\u20132020",
      description: "Re-engineered the global checkout system for automotive dealerships. Reduced latency, improved transaction reliability across high-stakes B2B2C flows. Worked with founding engineers during the platform's scale to $4B valuation.",
      impact: [
        { label: "Transaction Speed", value: "300%+" },
        { label: "Platform Valuation", value: "$4B" },
        { label: "Latency Reduction", value: "20%" },
        { label: "Monthly Users", value: "10k+" }
      ],
      tags: ["React Native", "AWS", "Microservices", "PostgreSQL"]
    },
    {
      title: "Intelligent Push Engine & Mobile Commerce",
      company: "FragranceNet.com",
      year: "2022\u2013Present",
      description: "Behavioral segmentation engine with real-time triggers that drove 30% sales uplift. NestJS microservices migration. OTA pipeline cutting deploy time by 50%. Mobile infrastructure behind 500k+ downloads.",
      impact: [
        { label: "Sales Uplift", value: "+30%" },
        { label: "Scalability", value: "+35%" },
        { label: "Deploy Time", value: "-50%" },
        { label: "Revenue Lift", value: "+7%" }
      ],
      tags: ["NestJS", "React Native", "AWS", "CI/CD", "GitHub Actions"]
    },
    {
      title: "Platform Performance Engineering",
      company: "Sonder Inc",
      year: "2021\u20132022",
      description: "Guest check-in performance overhaul: optimized network payloads, lazy-loaded assets, refined critical rendering paths. JS-to-TypeScript migration across core modules. Automated testing framework that stabilized deployments.",
      impact: [
        { label: "Load Time", value: "-40%" },
        { label: "Memory Footprint", value: "-25%" },
        { label: "Production Defects", value: "-50%" },
        { label: "Deploy Stability", value: "+35%" }
      ],
      tags: ["TypeScript", "Jest", "CI/CD", "React Native"]
    },
    {
      title: "Mission-Critical Banking Onboarding",
      company: "Mashreq Digital Bank",
      year: "2020\u20132021",
      description: "Regulated-grade onboarding system deployed across 50+ bank branches. Sub-0.1% crash rate in a zero-tolerance financial environment. iOS and Android.",
      impact: [
        { label: "Crash Rate", value: "<0.1%" },
        { label: "Branch Adoption", value: "50+" }
      ],
      tags: ["React Native", "Node.js", "Security", "Performance"]
    },
    {
      title: "Telehealth Ecosystem, Zero to Launch",
      company: "mfine",
      year: "2017\u20132018",
      description: "Doctor-facing telehealth MVP shipped in under 6 months. Patient interaction flows and appointment systems. 4.8/5 app rating. 60% partner acquisition boost.",
      impact: [
        { label: "Time to Market", value: "<6 Mo." },
        { label: "App Rating", value: "4.8/5" },
        { label: "Partner Boost", value: "+60%" }
      ],
      tags: ["React Native", "React", "LoopBack", "WebRTC"]
    },
    {
      title: "No-Code Mobile App Builder for Shopify",
      company: "Appify.it",
      year: "Side Project",
      description: "Multi-tenant SaaS platform where Shopify merchants build mobile apps via drag-and-drop. Kubernetes backend with ElasticSearch/Kibana observability. 500+ active merchants.",
      impact: [
        { label: "Active Merchants", value: "500+" },
        { label: "Architecture", value: "Multi-Tenant" }
      ],
      tags: ["Nest.js", "GraphQL", "RabbitMQ", "K3s", "React Native"]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-40 px-6"
    >
      <div className="max-w-[1400px] mx-auto">
        <header className="mb-32">
          <SectionLabel>Portfolio</SectionLabel>
          <h1 className="text-[clamp(2.5rem,8vw,6rem)] font-medium leading-none tracking-tighter mb-12">
            Selected<br />Engagements.
          </h1>
          <p className="text-xl text-white/40 max-w-2xl leading-relaxed">
            Architecture decisions and their measurable outcomes across fintech, automotive, e-commerce, and healthcare.
          </p>
        </header>

        <div className="space-y-0">
          {caseStudies.map((study, i) => (
            <CaseStudy key={i} {...study} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
