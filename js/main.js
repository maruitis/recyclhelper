// заменяем на тестовый проект
const supabaseUrl = "https://zzycxtlxhrtgcfdzgcsb.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6eWN4dGx4aHJ0Z2NmZHpnY3NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MDg0MzksImV4cCI6MjA5MDI4NDQzOX0.HdgX9ErkXLtUCOIO20TUPor0lz3kHI_JHQe7AFq42B8";

// создаём клиент
window.supabaseClient = window.supabaseClient || window.supabase.createClient(supabaseUrl, supabaseKey);
const supabase = window.supabaseClient;

// тестовый запрос
(async function test() {
  const { data, error } = await supabase.from('todos').select('*');
  if (error) console.error(error);
  else console.log("Todo data:", data);
})();