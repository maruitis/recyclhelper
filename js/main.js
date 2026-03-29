const supabaseUrl = "https://zzycxtlxhrtgcfdzgcsb.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6eWN4dGx4aHJ0Z2NmZHpnY3NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MDg0MzksImV4cCI6MjA5MDI4NDQzOX0.HdgX9ErkXLtUCOIO20TUPor0lz3kHI_JHQe7AFq42B8";

// Используем просто window.supabase для всех скриптов
window.supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

(async function test() {
  const { data, error } = await window.supabase.from('todos').select('*');
  if (error) console.error("Test error:", error);
  else console.log("Todo data:", data);
})();