// main.js
const supabaseUrl = "https://zzycxtlxhrtgcfdzgcsb.supabase.co";
const supabaseKey = "sb_publishable_DDFuLL3q18SJOdzlIb13JQ_zsZNn1d5";

// Если клиент Supabase уже создан, не создаём заново
window.supabaseClient = window.supabaseClient || window.supabase.createClient(supabaseUrl, supabaseKey);

// Локальный alias для удобства
const supabase = window.supabaseClient;

// Проверка, что клиент работает
console.log("Supabase client ready:", supabase);
(async function testSupabase() {
  try {
    const { data, error } = await supabase.from('your_table_name').select('*');
    if (error) {
      console.error("Supabase query error:", error);
    } else {
      console.log("Supabase data:", data);
    }
  } catch (e) {
    console.error("Supabase fetch failed:", e);
  }
})();