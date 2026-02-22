#!/usr/bin/env node
/**
 * Blog Post Schema Validator
 *
 * Usage: node scripts/validate-post.mjs content/blog/my-post.md
 *
 * Validates frontmatter schema for both human and agentic authoring.
 * Agentic posts (those with sources) get stricter validation.
 *
 * Exit codes:
 *   0 = valid
 *   1 = invalid (errors printed to stderr)
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

const REQUIRED_FIELDS = ['title', 'slug', 'date', 'excerpt', 'category', 'tags', 'readTime', 'status'];
const VALID_STATUSES = ['draft', 'published'];
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;

  const data = {};
  for (const line of match[1].split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();

    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
    } else if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  }

  return { data, content: match[2].trim() };
}

function validate(filepath) {
  const errors = [];
  const warnings = [];

  const raw = readFileSync(resolve(filepath), 'utf-8');
  const parsed = parseFrontmatter(raw);

  if (!parsed) {
    errors.push('Missing or malformed frontmatter (must start and end with ---)');
    return { errors, warnings };
  }

  const { data, content } = parsed;

  // Required fields
  for (const field of REQUIRED_FIELDS) {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Slug format
  if (data.slug && !SLUG_REGEX.test(data.slug)) {
    errors.push(`Invalid slug format: "${data.slug}" (must be lowercase alphanumeric with hyphens)`);
  }

  // Slug matches filename
  const filename = filepath.split('/').pop()?.replace('.md', '');
  if (data.slug && data.slug !== filename) {
    errors.push(`Slug "${data.slug}" does not match filename "${filename}"`);
  }

  // Date format
  if (data.date && !DATE_REGEX.test(data.date)) {
    errors.push(`Invalid date format: "${data.date}" (must be YYYY-MM-DD)`);
  }

  // Status
  if (data.status && !VALID_STATUSES.includes(data.status)) {
    errors.push(`Invalid status: "${data.status}" (must be one of: ${VALID_STATUSES.join(', ')})`);
  }

  // Tags must be array
  if (data.tags && !Array.isArray(data.tags)) {
    errors.push('Tags must be an array');
  }

  // Content length check
  if (content.length < 200) {
    warnings.push('Content is very short (< 200 characters)');
  }

  // Excerpt length
  if (data.excerpt && data.excerpt.length > 300) {
    warnings.push('Excerpt exceeds 300 characters — consider shortening');
  }

  // Agentic post validation (has sources field)
  if (data.sources !== undefined) {
    if (!Array.isArray(data.sources)) {
      errors.push('Sources must be an array');
    } else if (data.sources.length === 0 && data.status === 'published') {
      warnings.push('Agentic post has no sources — consider adding references to reduce hallucination risk');
    }
  }

  return { errors, warnings };
}

// --- Main ---
const filepath = process.argv[2];
if (!filepath) {
  console.error('Usage: node scripts/validate-post.mjs <path-to-markdown>');
  process.exit(1);
}

const { errors, warnings } = validate(filepath);

if (warnings.length > 0) {
  console.warn('\n⚠ Warnings:');
  warnings.forEach(w => console.warn(`  - ${w}`));
}

if (errors.length > 0) {
  console.error('\n✗ Validation failed:');
  errors.forEach(e => console.error(`  - ${e}`));
  process.exit(1);
} else {
  console.log(`\n✓ ${filepath} is valid`);
  process.exit(0);
}
