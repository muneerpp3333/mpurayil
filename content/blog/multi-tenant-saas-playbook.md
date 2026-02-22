---
title: The Multi-Tenant SaaS Playbook
slug: multi-tenant-saas-playbook
date: 2025-10-10
excerpt: Designing multi-tenant infrastructure that scales with your merchant base. Lessons from building a no-code mobile app builder on Kubernetes.
category: SaaS Architecture
tags: [SaaS, Kubernetes, Multi-Tenant, GraphQL, NestJS]
readTime: 14 min read
status: published
coverImage: https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=630&fit=crop&q=80
coverAlt: Earth from space with network connections representing distributed systems
coverCaption: Tenant isolation is the single most important architectural decision in a SaaS platform
sources: []
---

Multi-tenancy sounds simple until you're debugging why Merchant A's webhook is triggering Merchant B's notification pipeline. Tenant isolation is the single most important architectural decision in a SaaS platform, and getting it wrong is expensive to fix later.

## Isolation Models

There are three approaches, each with clear tradeoffs:

**Database-per-tenant.** Maximum isolation. Each tenant gets their own database instance. Easy to reason about, easy to back up, easy to delete. Expensive to operate at scale. Works when you have fewer than 100 tenants with high-value contracts.

**Schema-per-tenant.** Moderate isolation. One database, separate schemas. Reduces operational overhead while maintaining logical separation. Migration complexity increases linearly with tenant count.

**Shared schema with tenant ID.** Minimum isolation, maximum efficiency. Every query includes a `WHERE tenant_id = ?` filter. Cheapest to operate, hardest to get right. One missing filter and you have a data leak.

We used shared schema with tenant ID for Appify because we needed to scale to 500+ merchants without proportional infrastructure cost. The tradeoff: every database query, every cache key, every queue message must be tenant-scoped. We enforced this at the ORM level with a global middleware that injects tenant context.

## The Kubernetes Layer

Each merchant's mobile app runs as an isolated build pipeline on K3s. The build system:

1. Merchant updates their app config via the drag-and-drop builder
2. A build job is queued via RabbitMQ with tenant context
3. K3s spins up a build pod with resource limits (prevents one merchant's complex app from starving others)
4. The pod builds the React Native bundle, signs it, and pushes to the CDN
5. Pod terminates, resources are reclaimed

Resource limits per pod were critical. Without them, a merchant with 200 screens and heavy assets would consume the entire cluster during builds. With limits, builds queue fairly and the cluster stays stable.

## Observability Per Tenant

ElasticSearch with Kibana gave us per-tenant dashboards without tenant-specific infrastructure. Every log line, every metric, every trace includes the tenant ID as a field. Kibana filters let us view any merchant's experience in isolation.

This matters for support. When a merchant reports "my app is slow," you need to see their specific build times, API response times, and error rates, not the platform average.

## What Broke

**Cache poisoning across tenants.** Early on, a caching layer was keyed by resource path without tenant ID. Merchant A's product catalog was briefly served to Merchant B's app. We caught it in QA but it was a near-miss. Every cache key now includes tenant ID as the first segment.

**Queue ordering assumptions.** RabbitMQ doesn't guarantee ordering across consumers. When two builds for the same merchant were queued in rapid succession, sometimes the second build's output would be overwritten by the first build completing later. We added a build version counter and a "latest wins" check before CDN promotion.

## The Cost Model

Multi-tenant SaaS has to be cheaper per tenant than single-tenant, otherwise there's no business model. Our target was under $2/month infrastructure cost per active merchant. Shared database, shared compute, shared CDN, with isolation enforced in code rather than infrastructure. At 500+ merchants, we hit $1.40/month per merchant. The math works because the shared layers amortize well.
