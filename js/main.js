// main.js

if (!window.supabaseClient) {
  const SUPABASE_URL = "https://zzycxtlxhrtgcfdzgcsb.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6eWN4dGx4aHJ0Z2NmZHpnY3NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MDg0MzksImV4cCI6MjA5MDI4NDQzOX0.HdgX9ErkXLtUCOIO20TUPor0lz3kHI_JHQe7AFq42B8";

  // ВАЖНО: используем window.supabase
  window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  console.log("✅ Supabase initialized");
}
