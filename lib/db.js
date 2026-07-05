import fs from "node:fs";
import path from "node:path";
import { Pool } from "pg";
import { createClient } from "@supabase/supabase-js";

// Supabase's connection pooler presents a chain Node's bundled CA list
// doesn't recognize (confirmed: plain HTTPS to Supabase's own REST domain
// validates fine with Node's defaults, so this is specific to the pooler,
// not a local/network TLS interception issue). Pinning their actual root CA
// keeps verification on - rejectUnauthorized: false would "fix" this too,
// but by accepting any certificate at all, which opens the door to MITM.
const SUPABASE_CA = fs.readFileSync(path.join(process.cwd(), "certs", "supabase-ca.crt"), "utf8");

let pool;

// A pooled Postgres connection (Supabase's transaction pooler, not the direct
// connection) so many short-lived serverless invocations don't exhaust
// Postgres's own low connection limit. The pool itself is memoized so warm
// Lambda instances reuse it across requests instead of reconnecting each time.
function getDb() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { ca: SUPABASE_CA },
    });
  }
  return pool;
}

let storage;

// Separate client for Supabase Storage (slip images) - Storage is a REST/HTTP
// product, not part of the Postgres wire protocol, so it can't go through the
// pg Pool above.
function getStorage() {
  if (!storage) {
    storage = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  }
  return storage;
}

export default getDb;
export { getStorage };
