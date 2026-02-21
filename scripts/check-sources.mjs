import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);
const items = await sql`SELECT title, "sourceUrl", category FROM "jeek"."DigestItem" ORDER BY category, "order"`;
for (const item of items) {
  console.log(`[${item.category}] ${item.title}`);
  console.log(`  → ${item.sourceUrl}`);
  console.log();
}
process.exit(0);
