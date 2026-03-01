'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ExternalLink, Code, Database, Smartphone } from 'lucide-react';

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-4 mb-12">
    <div className="h-[1px] w-12 bg-white/20" />
    <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-white/40">{children}</span>
  </div>
);

const RepoCard = ({ name, description, language, tags, icon }: any) => (
  <a
    href="https://github.com/muneerpp3333"
    target="_blank"
    rel="noopener noreferrer"
    className="group bg-onyx p-10 hover:bg-white/[0.03] transition-all duration-500 flex flex-col justify-between min-h-[320px]"
  >
    <div>
      <div className="flex justify-between items-start mb-8">
        <div className="text-white/30 group-hover:text-white/50 transition-colors">{icon}</div>
        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-white/40" />
      </div>
      <h3 className="text-2xl font-medium mb-4 group-hover:translate-x-2 transition-transform duration-300">{name}</h3>
      <p className="text-white/50 text-sm leading-relaxed mb-8">{description}</p>
    </div>
    <div className="flex items-center justify-between">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag: string) => (
          <span key={tag} className="px-2 py-1 bg-white/[0.03] border border-white/10 text-[10px] font-mono text-white/30">{tag}</span>
        ))}
      </div>
      <div className="flex items-center gap-2 text-[10px] font-mono text-white/30">
        <div className="w-2 h-2 rounded-full bg-white/20" /> {language}
      </div>
    </div>
  </a>
);

export default function OpenSourceClient() {
  const repos = [
    {
      name: "appify-core",
      description: "The underlying engine for no-code mobile app generation. Distributed architecture with multi-tenant isolation for high-scale merchant deployments on Kubernetes.",
      language: "TypeScript",
      tags: ["Nest.js", "K3s", "GraphQL"],
      icon: <Database className="w-6 h-6" />
    },
    {
      name: "agentic-workflows-ts",
      description: "A lightweight framework for building autonomous AI agents with LangChain and Vector DBs. Production-ready patterns for RAG pipelines and tool orchestration.",
      language: "TypeScript",
      tags: ["LangChain", "Qdrant", "AI"],
      icon: <Code className="w-6 h-6" />
    },
    {
      name: "rn-perf-toolkit",
      description: "Low-level performance monitoring toolkit for React Native applications. Tracks frame drops, memory leaks, and bridge throughput with minimal overhead.",
      language: "TypeScript / C++",
      tags: ["React Native", "Performance"],
      icon: <Smartphone className="w-6 h-6" />
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
          <SectionLabel>Open Source</SectionLabel>
          <h1 className="text-[clamp(2.5rem,8vw,6rem)] font-medium leading-none tracking-tighter mb-12">
            Public<br />Contributions.
          </h1>
          <p className="text-xl text-white/40 max-w-2xl leading-relaxed">
            Patterns extracted from production systems. Open-sourced for the engineering community.
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-white/10 border border-white/10">
          {repos.map((repo, i) => (
            <RepoCard key={i} {...repo} />
          ))}
        </div>

        <div className="mt-32 border-t border-white/10 pt-20 text-center">
          <p className="text-sm font-mono text-white/20 uppercase tracking-[0.3em] mb-8">Full Activity</p>
          <a
            href="https://github.com/muneerpp3333"
            target="_blank"
            rel="noopener noreferrer"
            className="text-3xl md:text-5xl font-medium hover:text-white/60 transition-colors inline-flex items-center gap-8"
          >
            github.com/muneerpp3333 <ArrowUpRight className="w-10 h-10" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
