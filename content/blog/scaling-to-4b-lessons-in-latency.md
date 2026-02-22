---
title: "Scaling to $4B: Lessons in Latency"
slug: scaling-to-4b-lessons-in-latency
date: 2025-12-08
excerpt: Technical hurdles and architectural pivots required to scale a global automotive checkout pipeline. From 45-second transactions to sub-15-second completions.
category: Scalability
tags: [Performance, Microservices, AWS, Architecture]
readTime: 15 min read
status: published
coverImage: https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=630&fit=crop&q=80
coverAlt: Server racks in a modern data center representing high-throughput infrastructure
coverCaption: Latency optimization at scale is almost never about faster code
sources: []
---

When I joined the platform, global checkout transactions averaged 45 seconds. For automotive dealerships processing high-value purchases, that's not just slow. It's a trust problem. Nobody wants to stare at a spinner while a five-figure transaction processes.

The target was sub-15 seconds. We hit it. Here's what that required.

## The Bottleneck Map

Before optimizing anything, we profiled every millisecond of the transaction lifecycle. The breakdown:

- **Payment gateway round-trips**: 8-12s (unavoidable external latency)
- **Inventory lock verification**: 6-10s (database contention)
- **Tax calculation cascade**: 4-8s (synchronous multi-jurisdiction lookup)
- **Session hydration**: 3-5s (over-fetched user context)
- **Frontend rendering**: 2-3s (unoptimized bundle)

The payment gateway latency was fixed (that's the vendor's infrastructure). Everything else was ours to fix.

## The Architectural Shifts

**Inventory locks went optimistic.** Instead of synchronous lock-verify-proceed, we moved to optimistic locking with conflict resolution. The checkout starts immediately, inventory is reserved asynchronously, and conflicts (rare at our volume) are handled gracefully. This alone cut 6-8 seconds.

**Tax calculation became event-driven.** Instead of calculating taxes synchronously during checkout, we pre-computed taxes for common jurisdiction combinations and cached them. Edge cases fell through to real-time calculation but hit less than 5% of transactions.

**Session hydration got surgical.** The checkout endpoint was pulling the entire user profile, order history, and preferences. We trimmed it to exactly the fields the checkout flow needed. Payload went from 4MB to 200KB.

**Frontend went code-split.** The checkout bundle was loading the entire application. We isolated it into a dedicated chunk with only the components it needed. First meaningful paint dropped from 2.3s to 0.8s.

## What Held Up Under Scale

The optimistic locking pattern was the biggest win. Not just for latency. It fundamentally changed how the system handled concurrent access. At peak volume during product launches, the old synchronous locking would queue transactions. The new model let them flow in parallel.

The pre-computed tax cache had an unexpected benefit: it made the system resilient to tax service outages. When the external API went down, cached values served as a fallback. Not a permanent solution, but it bought time.

## What Broke

The event-driven tax model introduced eventual consistency issues early on. A price change in one system wouldn't reflect in cached tax calculations for up to 60 seconds. We solved it with cache invalidation on price-change events, but it took a production incident to discover the gap.

Optimistic locking also required a robust conflict resolution UI that didn't exist. When two dealerships reserved the same vehicle simultaneously, the loser got a generic error. Building a proper "vehicle no longer available" flow with alternative suggestions took another sprint.

## The Takeaway

Latency optimization at this scale is almost never about faster code. It's about doing less work per request, doing work in advance, and accepting that not everything needs to be synchronous. The 300% improvement came from architectural changes, not algorithm tweaks.
