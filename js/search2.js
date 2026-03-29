async function searchItem(itemName) {
  // 1. Ищем предмет по имени
  const { data: item, error: itemError } = await supabase
    .from('items')
    .select('items_id, name')
    .eq('name', itemName)
    .single();

  if (itemError) return console.error("Предмет не найден");

  // 2. Получаем 4 материала и 1 деталь для этого ID
  const { data: materials } = await supabase
    .from('materials')
    .select('*')
    .eq('items_id', item.id)
    .limit(4);

  const { data: details } = await supabase
    .from('details')
    .select('*')
    .eq('items_id', item.id)
    .limit(1);

  return { item, materials, details };
}



