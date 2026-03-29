async function loadCalculator(){

  const { data, error } = await supabase
    .from("calculator")
    .select("*")
    .eq("items_id", itemId)
    .eq("material_id", selectedMaterial)
    .single();
  if(error){
    console.error(error);
    return;
  }

  updateCalculator(data);

}