import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);
await sql`DELETE FROM "jeek"."DigestItem"`;
await sql`DELETE FROM "jeek"."Digest"`;
console.log("Deleted all digests");
process.exit(0);
