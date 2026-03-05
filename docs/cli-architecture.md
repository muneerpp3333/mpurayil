# `blogctl` — CLI Architecture for AI Agentic Blogging

## What This Is

A Python CLI tool that orchestrates a multi-agent blogging pipeline. You run commands like `blogctl research "agentic ai"` or `blogctl write --batch 5`. Under the hood, LangGraph manages agent coordination, Claude Code does the actual work, Playwright drives Ahrefs for keyword data, and Postgres tracks everything.

```
blogctl research "topic"     → Agent researches keywords via Ahrefs
blogctl seed                 → Agent evaluates keywords, creates skeletons
blogctl write                → Agent fills skeletons with real content
blogctl status               → Shows pipeline health
blogctl publish              → Promotes GENERATED → PUBLISHED
```

---

## Project Structure

```
blogctl/
├── cli.py                    # Click-based CLI entry point
├── config.py                 # Settings, DB URL, thresholds
├── graphs/
│   ├── research.py           # LangGraph: keyword research flow
│   ├── seed.py               # LangGraph: skeleton creation flow
│   ├── write.py              # LangGraph: content generation flow
│   └── full_pipeline.py      # LangGraph: research → seed → write
├── agents/
│   ├── keyword_researcher.md # Agent prompt: Ahrefs keyword research
│   ├── seed_strategist.md    # Agent prompt: evaluate + create skeletons
│   └── content_writer.md     # Agent prompt: fill content
├── mcp/
│   ├── browser.json          # Playwright + Postgres MCP config
│   └── db.json               # Postgres-only MCP config
├── browser-profiles/
│   └── ahrefs/               # Persistent Chromium profile (login once)
├── evidence/                  # Ahrefs screenshots per keyword
├── state/
│   └── checkpoints.db        # LangGraph checkpoint persistence (SQLite)
└── pyproject.toml
```

---

## CLI Design

### `blogctl research`

```bash
# Research a single topic
blogctl research "agentic ai workflows"

# Research with variants (auto-generates long-tails)
blogctl research "rag pipeline" --variants

# Research from a seed file
blogctl research --from-file seeds.txt

# Research with custom KD threshold
blogctl research "kubernetes production" --max-kd 30

# Dry run — show what would be researched without hitting Ahrefs
blogctl research "event driven architecture" --dry-run

# Resume interrupted research session
blogctl research --resume
```

**What happens:**
1. LangGraph `research` graph starts
2. Node 1: Load existing keywords from Postgres (avoid duplicates)
3. Node 2: Generate keyword variants if `--variants` flag
4. Node 3: For each keyword → Claude Code agent with Playwright MCP
   - Opens Ahrefs Keywords Explorer (persistent profile = already logged in)
   - Extracts: volume, KD, CPC, parent topic, SERP DRs
   - Navigates to Questions tab → extracts real questions
   - Navigates to Also Rank For → extracts cluster keywords
   - Screenshots saved to `evidence/`
5. Node 4: Store results in `keyword_research` table
6. Output: summary table in terminal

```
┌─────────────────────────────────┬────────┬────┬───────┐
│ Keyword                         │ Volume │ KD │ CPC   │
├─────────────────────────────────┼────────┼────┼───────┤
│ agentic ai workflows typescript │  2,400 │ 28 │ $3.20 │
│ agentic ai tutorial python      │  1,800 │ 22 │ $2.80 │
│ build ai agent from scratch     │  3,100 │ 35 │ $4.10 │
│ agentic ai best practices       │    890 │ 18 │ $2.50 │
└─────────────────────────────────┴────────┴────┴───────┘
4 keywords researched. 3 look promising (KD < 30).
Run `blogctl seed` to create skeletons.
```

### `blogctl seed`

```bash
# Evaluate all NEW keywords and create skeletons
blogctl seed

# Seed only from a specific category
blogctl seed --category "AI Architecture"

# Seed with custom volume threshold
blogctl seed --min-volume 200 --max-kd 35

# Limit batch size
blogctl seed --limit 5

# Preview what would be created
blogctl seed --dry-run
```

**What happens:**
1. LangGraph `seed` graph starts
2. Node 1: Query `keyword_research` WHERE status = 'NEW', ordered by volume DESC
3. Node 2: Query existing `blog_posts` to understand coverage gaps
4. Node 3: Claude Code agent evaluates each keyword:
   - Applies volume/KD/competition gates
   - Checks for keyword cannibalization against existing posts
   - Determines article type from keyword intent
   - Generates custom section outline (not generic template)
   - Crafts excerpt using exact Ahrefs phrasing
   - Builds FAQ from real Ahrefs questions
5. Node 4: INSERT approved skeletons into `blog_posts`
6. Node 5: UPDATE keyword status to APPROVED/REJECTED

```
┌─────────────────────────────────┬──────────┬─────────────────┐
│ Keyword                         │ Decision │ Reason          │
├─────────────────────────────────┼──────────┼─────────────────┤
│ agentic ai workflows typescript │ APPROVED │ vol 2400, KD 28 │
│ agentic ai tutorial python      │ APPROVED │ vol 1800, KD 22 │
│ build ai agent from scratch     │ REJECTED │ KD 35 (> 30)    │
│ agentic ai best practices       │ APPROVED │ vol 890, KD 18  │
└─────────────────────────────────┴──────────┴─────────────────┘
3 skeletons created. Run `blogctl write` to generate content.
```

### `blogctl write`

```bash
# Write next available skeleton
blogctl write

# Write a batch of 5
blogctl write --batch 5

# Write a specific post by slug
blogctl write --slug "agentic-ai-workflows-guide-typescript"

# Write with a specific model
blogctl write --model opus

# Parallel writing (multiple Claude instances)
blogctl write --batch 5 --parallel 3

# Resume from where it stopped
blogctl write --resume
```

**What happens:**
1. LangGraph `write` graph starts
2. Node 1: Query SKELETON posts (with keyword data joined)
3. Node 2: Claim post (UPDATE SET status = 'GENERATING' WHERE status = 'SKELETON')
4. Node 3: Claude Code agent generates content:
   - Uses primary keyword for natural placement
   - Uses secondary keywords for subtopic coverage
   - Uses Ahrefs questions for real FAQ answers
   - Includes Conclusion section
   - Targets word count based on readTime
5. Node 4: Write back to DB (status = 'GENERATED')
6. Node 5: Validation check (word count, heading structure, FAQ present)
7. If `--parallel`: LangGraph fan-out to multiple writer nodes

```
Writing: "Complete Guide to Agentic AI Workflows with TypeScript"
  ├── Generating content... (est. 2-3 min)
  ├── Word count: 2,847 ✓ (target: 2,400-3,000)
  ├── Sections: 8 ✓
  ├── FAQ: 5 questions ✓ (from Ahrefs data)
  ├── Conclusion: present ✓
  └── Status: GENERATED ✓

1/5 complete. Continuing...
```

### `blogctl status`

```bash
# Full pipeline overview
blogctl status

# Detailed view for a specific stage
blogctl status research
blogctl status skeletons
blogctl status content

# Export as JSON
blogctl status --json
```

```
Blog Pipeline Status
════════════════════════════════════════════════════

Keywords Researched:     85
  ├── Approved:          34  (targeting 48,200 monthly searches)
  ├── Rejected:          41
  └── Pending:           10

Content Pipeline:
  ├── SKELETON:          12  → run `blogctl write`
  ├── GENERATING:         0
  ├── GENERATED:         22  → run `blogctl publish`
  ├── REVIEWED:           0
  └── PUBLISHED:          4  (hand-written, protected)
                         ──
  Total live posts:      26

Top performing keywords (by volume):
  1. agentic ai workflows typescript — 2,400/mo (GENERATED)
  2. rag pipeline python tutorial     — 1,800/mo (SKELETON)
  3. multi tenant saas architecture   — 1,600/mo (GENERATED)
```

### `blogctl publish`

```bash
# Promote all GENERATED to PUBLISHED
blogctl publish

# Publish specific post
blogctl publish --slug "agentic-ai-workflows-guide-typescript"

# Publish with review step (opens in browser for human review)
blogctl publish --review

# Publish and trigger site rebuild
blogctl publish --deploy
```

### `blogctl login`

```bash
# Open browser for Ahrefs login (saves session to persistent profile)
blogctl login ahrefs

# Check if sessions are still valid
blogctl login --check
```

---

## LangGraph Architecture

### Research Graph

```python
# graphs/research.py

class ResearchState(TypedDict):
    seed_keywords: list[str]       # input keywords to research
    existing_keywords: list[str]   # already in DB (dedup)
    variants: list[str]            # generated long-tail variants
    results: list[KeywordResult]   # Ahrefs data per keyword
    errors: list[str]              # failed lookups
    session_valid: bool            # Ahrefs login still active

class KeywordResult(TypedDict):
    keyword: str
    volume: int
    kd: int
    cpc: float
    parent_topic: str
    serp_drs: list[int]
    questions: list[str]
    also_rank_for: list[str]
    screenshot_path: str

# Graph nodes
load_existing     → Check DB for already-researched keywords
generate_variants → Create long-tail variants from seed
check_session     → Verify Ahrefs login is active
research_keyword  → Claude Code + Playwright: scrape one keyword
store_results     → Write to keyword_research table
should_continue   → Conditional: more keywords? session valid?

# Graph edges
START → load_existing → generate_variants → check_session
check_session → research_keyword (if session valid)
check_session → END (if session expired, log error)
research_keyword → store_results → should_continue
should_continue → research_keyword (if more keywords)
should_continue → END (if done)
```

### Seed Graph

```python
# graphs/seed.py

class SeedState(TypedDict):
    pending_keywords: list[KeywordResult]  # NEW status keywords
    existing_posts: list[PostMeta]         # current coverage
    decisions: list[SeedDecision]          # approve/reject per keyword
    skeletons_created: int

class SeedDecision(TypedDict):
    keyword: str
    decision: str      # APPROVED | REJECTED
    reason: str
    slug: str | None   # if approved
    article_type: str | None

# Graph nodes
load_keywords     → Query keyword_research WHERE status = 'NEW'
load_coverage     → Query blog_posts for existing topic map
evaluate_keyword  → Claude Code: apply gates, check cannibalization
create_skeleton   → Claude Code: generate custom outline + insert DB
update_keyword    → Mark keyword as APPROVED/REJECTED

# Graph edges
START → load_keywords → load_coverage → evaluate_keyword
evaluate_keyword → create_skeleton (if approved)
evaluate_keyword → update_keyword (if rejected) → should_continue
create_skeleton → update_keyword → should_continue
should_continue → evaluate_keyword (next keyword)
should_continue → END
```

### Write Graph

```python
# graphs/write.py

class WriteState(TypedDict):
    target_slugs: list[str] | None  # specific slugs, or None for next available
    batch_size: int
    written: int
    current_post: PostWithKeywords | None
    validation_result: ValidationResult | None

class ValidationResult(TypedDict):
    word_count: int
    word_count_ok: bool
    has_conclusion: bool
    has_faq: bool
    faq_count: int
    heading_structure_ok: bool
    passed: bool

# Graph nodes
claim_post        → SELECT + UPDATE with row lock
load_keyword_data → JOIN keyword_research for context
generate_content  → Claude Code: write the full post
validate_content  → Check word count, structure, FAQ presence
save_or_retry     → If valid: save as GENERATED. If not: retry once.
release_post      → On failure: reset to SKELETON

# Graph edges
START → claim_post → load_keyword_data → generate_content
generate_content → validate_content
validate_content → save_or_retry (if passed)
validate_content → generate_content (if failed, max 1 retry)
save_or_retry → should_continue
should_continue → claim_post (if batch not complete)
should_continue → END
```

### Full Pipeline Graph

```python
# graphs/full_pipeline.py

# Composes all three graphs into one run
START → research_subgraph → seed_subgraph → write_subgraph → END

# With conditional routing:
# - If research finds 0 viable keywords → END early
# - If seed creates 0 skeletons → END early
# - If write hits API budget limit → pause, resume later
```

---

## State Persistence & Resume

LangGraph supports **checkpointing** — saving graph state at each node so you can resume after interruption.

```python
from langgraph.checkpoint.sqlite import SqliteSaver

# Persist state to local SQLite
checkpointer = SqliteSaver.from_conn_string("state/checkpoints.db")

graph = workflow.compile(checkpointer=checkpointer)

# First run (might get interrupted)
config = {"configurable": {"thread_id": "research-2026-03-05"}}
result = await graph.ainvoke(initial_state, config)

# Resume after interruption — picks up exactly where it stopped
result = await graph.ainvoke(None, config)
```

This means:
- `blogctl research --resume` resumes the last research run from the exact keyword it was on
- `blogctl write --resume` picks up from the exact post it was writing
- No duplicate work, no lost progress

---

## Parallel Writing Architecture

For `blogctl write --batch 10 --parallel 3`:

```python
# LangGraph fan-out pattern
async def parallel_write_node(state: WriteState) -> WriteState:
    """Spawn 3 concurrent Claude Code instances"""

    skeletons = state["pending_skeletons"][:state["batch_size"]]

    # Split into chunks for parallel workers
    chunks = split_into_n(skeletons, state["parallel_count"])

    # Each worker gets its own Claude Code subprocess
    tasks = []
    for i, chunk in enumerate(chunks):
        task = write_worker(
            chunk,
            worker_id=i,
            mcp_config="mcp/db.json",
        )
        tasks.append(task)

    # Run concurrently
    results = await asyncio.gather(*tasks)

    state["written"] = sum(r["count"] for r in results)
    return state
```

Each parallel worker claims posts independently (the `WHERE content_status = 'SKELETON'` lock prevents collisions). Three Claude instances writing simultaneously = 3x throughput.

---

## Budget Controls

```python
# config.py

BUDGET = {
    "research": {
        "max_per_run_usd": 2.00,     # Ahrefs scraping is cheap (mostly Playwright)
        "model": "sonnet",
        "max_turns_per_keyword": 15,
    },
    "seed": {
        "max_per_run_usd": 1.00,     # DB queries + evaluation, lightweight
        "model": "sonnet",
        "max_turns_per_keyword": 5,
    },
    "write": {
        "max_per_post_usd": 0.50,    # Sonnet is cost-efficient for long-form
        "max_per_run_usd": 5.00,
        "model": "sonnet",            # Use opus for flagship posts
        "max_turns_per_post": 10,
    },
}
```

Passed to Claude Code via `--max-budget-usd` flag per invocation.

---

## MCP Configurations

### `mcp/browser.json` (Agent 1: Keyword Research)

```json
{
  "mcpServers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "@playwright/mcp@latest",
        "--user-data-dir", "./browser-profiles/ahrefs"
      ]
    },
    "postgres": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y", "@modelcontextprotocol/server-postgres",
        "${DATABASE_URL}"
      ]
    }
  }
}
```

### `mcp/db.json` (Agents 2 & 3: Seed + Write)

```json
{
  "mcpServers": {
    "postgres": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y", "@modelcontextprotocol/server-postgres",
        "${DATABASE_URL}"
      ]
    }
  }
}
```

---

## Agent Prompts

Each agent prompt is a markdown file read at runtime. This means you can edit the prompts without changing code — iterate on agent behavior by editing markdown.

```python
# Inside a LangGraph node
async def research_keyword_node(state):
    prompt = Path("agents/keyword_researcher.md").read_text()

    # Inject runtime context into the prompt
    prompt += f"\n\n## Current Task\nResearch this keyword: {state['current_keyword']}"
    prompt += f"\nAlready researched (skip these): {state['existing_keywords']}"

    async for message in query(
        prompt=prompt,
        options=ClaudeAgentOptions(
            mcp_config="mcp/browser.json",
            allowed_tools=["mcp__playwright__*", "mcp__postgres__query"],
            max_turns=15,
            max_budget_usd=0.50,
        ),
    ):
        # ...
```

---

## Installation & Setup

```bash
# Install
pip install blogctl  # or: pip install -e . (from repo)

# Initialize (creates config, DB tables, browser profile dir)
blogctl init

# Login to Ahrefs (opens browser, you log in, session persists)
blogctl login ahrefs

# Set database URL
blogctl config set database_url "postgresql://user:pass@localhost:5432/blog"

# Verify everything works
blogctl doctor
```

`blogctl doctor` output:
```
Checking blogctl setup...
  ✓ Python 3.11+
  ✓ Claude Code CLI installed (v1.x)
  ✓ Claude auth valid (API key set)
  ✓ Playwright installed
  ✓ PostgreSQL reachable
  ✓ keyword_research table exists
  ✓ blog_posts table exists
  ✓ Ahrefs session active (expires ~Mar 20)
  ✓ MCP configs valid

All checks passed. Ready to go.
```

---

## Typical Workflow

```bash
# Monday: Research new keywords
blogctl research "vector database" "rag pipeline" "llm fine tuning" --variants
# → Researches ~15 keywords via Ahrefs, stores in DB

# Tuesday: Review and create skeletons
blogctl status research          # see what was found
blogctl seed --min-volume 200    # create skeletons for viable keywords
# → Creates 8 skeletons with custom outlines

# Wednesday-Friday: Generate content
blogctl write --batch 5 --parallel 2
# → 5 posts written, 2 at a time

# Friday: Review and publish
blogctl publish --review          # opens each in browser for quick review
blogctl publish --deploy          # promotes to PUBLISHED, triggers site build
```

Or run the full pipeline in one shot:

```bash
blogctl run "agentic ai" "rag pipeline" --end-to-end
# → Research → Seed → Write → done
```
