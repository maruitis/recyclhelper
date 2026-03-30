if (!supabase) {
  console.error("❌ Supabase client not initialized");
}

// item.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://zzycxtlxhrtgcfdzgcsb.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6eWN4dGx4aHJ0Z2NmZHpnY3NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MDg0MzksImV4cCI6MjA5MDI4NDQzOX0.HdgX9ErkXLtUCOIO20TUPor0lz3kHI_JHQe7AFq42B8";
const supabase = createClient(supabaseUrl, supabaseKey);

const currentItemId = 1; 


const materialsGrid = document.getElementById("materialsGrid");
const diyCards = document.getElementById("diyCards");
const lifehacksColumns = document.getElementById("lifehacksColumns");
const calculatorSection = document.getElementById("calculator");

async function loadMaterials() {
  const { data: materials, error } = await supabase
    .from("materials")
    .select("*")
    .eq("items_id", currentItemId);

  if (error) return console.error("Materials error:", error);

 
  materialsGrid.innerHTML = "";

  materials.forEach(mat => {
    const btn = document.createElement("button");
    btn.textContent = mat.name; 
    btn.className = "material-card";
    btn.onclick = () => selectMaterial(mat.id);
    materialsGrid.appendChild(btn);
  });
}


async function selectMaterial(materialId) {
  console.log("Выбран материал:", materialId);

 
  const { data: lifehacks, error: lhError } = await supabase
    .from("diy")
    .select("*")
    .eq("material_id", materialId);

  if (lhError) return console.error("Lifehacks error:", lhError);

  lifehacksColumns.innerHTML = "";
  lifehacks.forEach(lh => {
    const li = document.createElement("li");
    li.textContent = lh.text;
    lifehacksColumns.appendChild(li);
  });


  const { data: calcData, error: calcError } = await supabase
    .from("calculator")
    .select("*")
    .eq("material_id", materialId);

  if (calcError) return console.error("Calculator error:", calcError);

  renderCalculator(calcData);
}


function renderCalculator(calcData) {
  calculatorSection.innerHTML = "";
  calcData.forEach(item => {
    const div = document.createElement("div");
    div.textContent = `${item.name}: ${item.value}`;
    calculatorSection.appendChild(div);
  });
}


loadMaterials();



