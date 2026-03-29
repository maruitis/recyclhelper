

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

document.addEventListener("DOMContentLoaded", () => {

  if(item_id){

    loadMaterials();

  }

});
// GET ITEM ID FROM URL

const params = new URLSearchParams(window.location.search);

const itemId = params.get("id");

let selectedMaterial = null;
let quantity = 1;


// LOAD MATERIALS

async function loadMaterials(){

  if(!itemId) return;

  const { data, error } = await supabase
    .from("materials")
    .select("*")
    .eq("items_id", itemId);

  if(error){

    console.error(error);
    return;

  }

  const container = document.getElementById("materials");

  if(!container) return;

  container.innerHTML = "";

  data.forEach(material => {

    const btn = document.createElement("button");

    btn.textContent = material.material_name;

    btn.className = "material-card";

    btn.onclick = () => selectMaterial(material.material_id);

    container.appendChild(btn);

  });

}


// SELECT MATERIAL

function selectMaterial(id){

  selectedMaterial = id;

  loadCalculator();
  loadDiy();

}


// LOAD CALCULATOR

async function loadCalculator(){

  if(!selectedMaterial) return;

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


// UPDATE CALCULATOR

function updateCalculator(calc){

  const water =
    calc.water_saved_liters * quantity;

  const energy =
    calc.energy_saved_kwh * quantity;

  const co2 =
    calc.co2_saved_kg * quantity;

  const waterEl = document.getElementById("water");
  const energyEl = document.getElementById("energy");
  const co2El = document.getElementById("co2");

  if(waterEl) waterEl.textContent = water;
  if(energyEl) energyEl.textContent = energy;
  if(co2El) co2El.textContent = co2;

}


// PAGE LOAD

document.addEventListener("DOMContentLoaded", () => {

  loadMaterials();

});

const minus = document.getElementById("qtyMinus");
const plus = document.getElementById("qtyPlus");
const value = document.getElementById("qtyValue");

if(minus && plus){

minus.onclick = () => {

  if(quantity > 1){
    quantity--;
    value.textContent = quantity;
    loadCalculator();
  }

};

plus.onclick = () => {

  quantity++;
  value.textContent = quantity;
  loadCalculator();

};

}
