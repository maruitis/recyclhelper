/const supabaseUrl = "https://zzycxtlxhrtgcfdzgcsb.supabase.co";
const supabaseKey = "sb_publishable_DDFuLL3q18SJOdzlIb13JQ_zsZNn1d5"; // Убедись, что ключ верный (anon public)

// Используем другое имя переменной, чтобы не было конфликта с глобальным объектом библиотеки
const db = supabase.createClient(supabaseUrl, supabaseKey);

// Проверка
console.log("Supabase client ready:", db);

(async function testSupabase() {
  try {
    // ЗАМЕНИ 'your_table_name' на реальное название своей таблицы!
    const { data, error } = await db.from('posts').select('*'); 
    
    if (error) {
      console.error("Ошибка запроса:", error.message);
    } else {
      console.log("Данные из базы:", data);
    }
  } catch (e) {
    console.error("Сбой подключения:", e);
  }
})();
