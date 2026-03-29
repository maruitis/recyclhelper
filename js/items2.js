
const supabase = window.supabaseClient;
if (!supabase) {
  console.error("Supabase client not initialized");
}
function escapeHtml(s) {
    const d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }
async function getDiyIdeas(itemId, materialId) {
  if (!supabase) return [];
  try {
    let query = supabase.from('diy').select('*').eq('items_id', itemId);
    if (materialId !== null) query = query.eq('material_id', materialId);
    const { data: ideas, error } = await query.limit(3);
    if (error) {
      console.warn("Ошибка при получении DIY:", error.message);
      return [];
    }
    return ideas || [];
  } catch(e) {
    console.warn("Не удалось получить DIY:", e);
    return [];
  }
}


async function calculateEfficiency(itemId, materialId, count) {
  if (!supabase) return { totalEnergy: 0, totalWater: 0, totalCO2: 0 };
  try {
    let query = supabase
      .from('calculator')
      .select('energy_saved_kwh, water_saved_liters, co2_saved_kg')
      .eq('items_id', itemId);
    if (materialId !== null) query = query.eq('material_id', materialId);
    const { data, error } = await query.limit(1);
    if (error || !data || !data.length) return { totalEnergy: 0, totalWater: 0, totalCO2: 0 };
    const calcData = data[0];
    return {
      totalEnergy: (calcData.energy_saved_kwh || 0) * count,
      totalWater: (calcData.water_saved_liters || 0) * count,
      totalCO2: (calcData.co2_saved_kg || 0) * count
    };
  } catch(e) {
    console.warn("Ошибка расчета эффективности:", e);
    return { totalEnergy: 0, totalWater: 0, totalCO2: 0 };
  }
}



