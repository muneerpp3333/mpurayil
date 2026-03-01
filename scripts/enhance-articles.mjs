import Anthropic from '@anthropic-ai/sdk';
import { readdir, readFile, writeFile } from 'fs/promises';
import { join, resolve } from 'path';

const BLOG_DIR = resolve('content/blog');
const PROGRESS_FILE = resolve('.enhance-progress.json');
const BATCH_SIZE = 5;
const DELAY_MS = 2000;

const client = new Anthropic();

const ENHANCE_PROMPT = `You are a senior software engineer writing technical blog content. Given the following markdown article skeleton, replace ALL placeholder comments (<!-- CONTENT: ... -->) with 2-3 paragraphs of substantive, technical content. Replace ALL code placeholders (// TODO: ...) with real, working code examples.

Rules:
- Keep ALL frontmatter exactly as-is (do not modify anything between --- markers)
- Keep ALL headings (## and ###) exactly as-is
- Write in a professional, direct tone — no filler, no "in today's world" openings
- Make content specific to the technologies in the title and tags
- Code examples should be realistic and production-quality
- FAQ answers should be 2-3 sentences, direct and informative
- Do not add new sections or headings
- Return the COMPLETE markdown file with all placeholders replaced`;

async function loadProgress() {
  try {
    const data = await readFile(PROGRESS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { processed: [], failed: [] };
  }
}

async function saveProgress(progress) {
  await writeFile(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

function hasPlaceholders(content) {
  return content.includes('<!-- CONTENT:') || content.includes('// TODO:');
}

function getSlugFromFilename(filename) {
  return filename.replace(/\.md$/, '');
}

async function enhanceArticle(filePath) {
  const content = await readFile(filePath, 'utf-8');

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `${ENHANCE_PROMPT}\n\n---\n\nHere is the article skeleton:\n\n${content}`,
      },
    ],
  });

  const enhanced = response.content[0].text;
  await writeFile(filePath, enhanced);
}

async function processBatch(batch, progress, totalCount, startIndex) {
  const results = await Promise.all(
    batch.map(async ({ filePath, slug }, i) => {
      const idx = startIndex + i + 1;
      console.log(`[${idx}/${totalCount}] Enhancing: ${slug}.md`);
      try {
        await enhanceArticle(filePath);
        return { slug, status: 'ok' };
      } catch (err) {
        console.error(`  ERROR (${slug}): ${err.message}`);
        return { slug, status: 'failed' };
      }
    })
  );

  for (const r of results) {
    if (r.status === 'ok') {
      progress.processed.push(r.slug);
    } else {
      progress.failed.push(r.slug);
    }
  }

  await saveProgress(progress);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const progress = await loadProgress();

  // Graceful exit
  let interrupted = false;
  const onSigint = async () => {
    if (interrupted) process.exit(1);
    interrupted = true;
    console.log('\nInterrupted — saving progress...');
    await saveProgress(progress);
    process.exit(0);
  };
  process.on('SIGINT', onSigint);

  const files = (await readdir(BLOG_DIR)).filter((f) => f.endsWith('.md'));
  const alreadyDone = new Set([...progress.processed, ...progress.failed]);

  // Collect files that need enhancing
  const toProcess = [];
  for (const file of files) {
    const slug = getSlugFromFilename(file);
    if (alreadyDone.has(slug)) continue;

    const filePath = join(BLOG_DIR, file);
    const content = await readFile(filePath, 'utf-8');
    if (!hasPlaceholders(content)) continue;

    toProcess.push({ filePath, slug });
  }

  const totalCount = toProcess.length;
  const skipped = files.length - totalCount - alreadyDone.size;
  console.log(
    `Found ${totalCount} articles to enhance (${alreadyDone.size} already done, ${skipped + alreadyDone.size} skipped)`
  );

  if (totalCount === 0) {
    console.log('Nothing to do.');
    return;
  }

  // Process in batches
  for (let i = 0; i < toProcess.length; i += BATCH_SIZE) {
    if (interrupted) break;
    const batch = toProcess.slice(i, i + BATCH_SIZE);
    await processBatch(batch, progress, totalCount, i);

    if (i + BATCH_SIZE < toProcess.length) {
      await delay(DELAY_MS);
    }
  }

  // Summary
  const enhanced = progress.processed.length;
  const failed = progress.failed.length;
  console.log(`\nDone: ${enhanced} enhanced, ${failed} failed`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
