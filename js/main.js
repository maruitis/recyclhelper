// заменяем на тестовый проект
const supabaseUrl = "https://rvfzblgemdjfyrfaktws.supabase.co";
const supabaseKey = "sb_publishable_CHsxF2C8LQ9t2bYb9xDEJZkz";

// создаём клиент
window.supabaseClient = window.supabaseClient || window.supabase.createClient(supabaseUrl, supabaseKey);
const supabase = window.supabaseClient;

// тестовый запрос
(async function test() {
  const { data, error } = await supabase.from('todos').select('*');
  if (error) console.error(error);
  else console.log("Todo data:", data);
})();