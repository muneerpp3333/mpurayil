# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Dev server on port 3005
npm run build        # Production build (auto-runs sitemap generation first)
npm run preview      # Preview production build
npm run lint         # TypeScript type check (no emit)
npm run sitemap      # Regenerate sitemap manually
npm run validate:post # Validate a blog post frontmatter
npm run clean        # Remove dist/
```

## Architecture

**Stack:** React 19 + React Router 7 + Vite 6 + Tailwind CSS 4 + TypeScript

**SPA with client-side SEO:** No SSR. Meta tags and JSON-LD structured data are injected client-side via `src/components/SEOHead.tsx`. JSON-LD schemas used: `Person`, `WebSite`, `ProfessionalService`, `TechArticle`, `CollectionPage`, `BreadcrumbList`, `FAQPage`.

**Blog system:** Markdown files in `content/blog/` are loaded at build time via `import.meta.glob`. Custom YAML frontmatter parser lives in `src/lib/blog.ts` (not js-yaml). Posts must include: `title`, `slug`, `date`, `excerpt`, `category`, `tags`, `readTime`, `status`.

**Template catalog:** All 14 templates defined in `src/data/templates.ts` with Sanity CMS image URLs, pricing (1499 AED), Stripe order links, and feature lists. Helper functions: `getTemplateBySlug`, `getFeaturedTemplates`, `getRelatedTemplates`.

**Sitemap:** `scripts/generate-sitemap.mjs` runs as `prebuild` — reads all blog post frontmatter and hardcoded routes to generate `public/sitemap.xml`.

## Routes

```
/                    → Home (hero, stats, case studies, services, blog preview, templates)
/portfolio           → Case studies
/templates           → Template gallery with category filtering
/templates/:slug     → Template detail with previews and Stripe checkout
/open-source         → Open-source projects
/blog                → Blog listing
/blog/:slug          → Blog post (markdown rendered)
#intake              → Anchor to intake form in App.tsx footer
```

## Styling Conventions

- Tailwind v4 — uses `@theme` in `src/index.css`, no `tailwind.config.js`
- Color tokens: `--color-onyx` (#050505), `--color-ink` (#111111), `--color-surface` (#0a0a0a)
- Section labels: `text-[10px] uppercase tracking-widest`
- Path alias `@/` maps to project root (configured in `vite.config.ts` and `tsconfig.json`)
- Animation library: `motion` (not framer-motion directly)

## Adding Blog Posts

1. Create `content/blog/your-slug.md` with required frontmatter
2. Run `npm run validate:post` to check frontmatter
3. Sitemap updates automatically on next build
