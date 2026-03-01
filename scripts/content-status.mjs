/**
 * Quick CLI to check blog content generation progress
 */

import 'dotenv/config';
import pkg from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const { PrismaClient } = pkg;
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const counts = await prisma.$queryRaw`
    SELECT "contentStatus", COUNT(*)::int as count
    FROM "BlogPost"
    GROUP BY "contentStatus"
    ORDER BY "contentStatus"
  `;

  const total = await prisma.blogPost.count();
  const protectedCount = await prisma.blogPost.count({ where: { isProtected: true } });

  console.log('Blog Content Status');
  console.log('===================');
  for (const row of counts) {
    const padded = row.contentStatus.padEnd(12);
    console.log(`  ${padded} ${row.count}`);
  }
  console.log(`  ${'TOTAL'.padEnd(12)} ${total}`);
  console.log(`  ${'PROTECTED'.padEnd(12)} ${protectedCount}`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
