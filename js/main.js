const supabaseUrl = "https://zzycxtlxhrtgcfdzgcsb.supabase.co";
// Вставь сюда ANON KEY из настроек Supabase (тот, что длинный и на 'ey...')
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6eWN4dGx4aHJ0Z2NmZHpnY3NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MDg0MzksImV4cCI6MjA5MDI4NDQzOX0.HdgX9ErkXLtUCOIO20TUPor0lz3kHI_JHQe7AFq42B8"; 

// Создаем клиент с НОВЫМ именем 'db', чтобы не было конфликтов
const db = supabase.createClient(supabaseUrl, supabaseKey);

async function test() {
    // ВАЖНО: замени 'posts' на название СВОЕЙ таблицы
    const { data, error } = await db.from('items').select('*');
    
    if (error) {
        console.error("Ошибка:", error.message);
    } else {
        console.log("Успех! Данные:", data);
    }
}

test();
