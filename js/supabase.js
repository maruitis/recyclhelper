// supabase.js — project URL only (not /rest/v1/)
const SUPABASE_URL = "https://ydlfaqhdthejhqgrsrpa.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkbGZhcWhkdGhlamhxZ3JzcnBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMzIyNzYsImV4cCI6MjA5NjYwODI3Nn0.W3dImHKax78oO0ehwuWR0DEhrxeZJLIBc7okA742SvM";

const sb = window.supabase;
const createClient =
  sb && typeof sb.createClient === "function"
    ? sb.createClient
    : sb && sb.default && typeof sb.default.createClient === "function"
      ? sb.default.createClient
      : null;

if (!createClient) {
  console.error("Supabase JS library did not load. Check the CDN script tag.");
} else {
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  window.supabase = client;
}
