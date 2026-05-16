/* ── DIY image lookup (project.name → filename in images/) ── */
const diyImages = {
    "Self-Watering Planter":     "Self-Watering Planter_plastic bottle.png",
    "Hanging Bird Feeder":       "Hanging Bird Feeder_plastic bottle.png",
    "Desk Pencil Cup":           "Desk Pencil Cup_plastic bottle.png",
    "Dish Soap Dispenser":       "Dish Soap Dispenser_glass bottle.png",
    "Table Centerpiece":         "Table Centerpiece_glass bottle.png",
    "Glass Lamp":                "Glass Lamp_glass bottle.png",
    "Herb Kitchen Garden":       "Herb Kitchen Garden_glass jar.png",
    "Candle Holder":             "Candle Holder_glass jar.png",
    "Fermentation Jar":          "Fermentation Jar_glass jar.png",
    "Desk Organiser Set":        "Desk Organiser Set_tin can.png",
    "Candle Lantern":            "Candle Lantern_tin can.png",
    "Garden Herb Pot":           "GardenHerb Pot_tincan.png",
    "Hidden Safe":               "hidden safe_book.png",
    "Book Planter":              "Book Planter_book.png",
    "Floating Shelf":            "Floating Shelf_book.png",
    "Papier-Mâché Bowl":        "Papier-MâchéBowl_newspaper.png",
    "Fire Starters":             "FireStarters _newspaper.png",
    "Gift Wrapping":             "GiftWrapping_newspaper.png",
    "Seed Paper":                "SeedPaper_paper.png",
    "Gift Bows":                 "Gift Bows_paper.png",
    "Paper Beads":               "PaperBeads_paper.png",
    "Cozy Cushion":              "CozyCushion_sweater.png",
    "Mittens":                   "Mittens_sweater.png",
    "Wine Bag":                  "WineBag_sweater.png",
    "Denim Tote Bag":            "DenimToteBag_jeans.png",
    "Denim Pot Plant Cover":     "DenimPotPlantCover_jeans.png",
    "Patched Notebook Cover":    "PatchedNotebookCover_jeans.png",
    "Emergency Light":           "EmergencyLight_batteries.png",
    "Magnetic Stirrer":          "MagneticStirrer_batteries.png",
    "Battery Organizer":         "BatteryOrganizer_batteries.png",
    "Digital Photo Frame":       "DigitalPhotoFrame_laptop.png",
    "External Hard Drive":       "ExternalHardDrive_laptop.png",
    "Smart Mirror":              "SmartMirror_laptop.png",
    "Dedicated Music Player":    "DedicatedMusicPlayer_mobilephone.png",
    "Security Camera":           "SecurityCamera_mobilephone.png",
    "Smart Bedside Clock":       "SmartBedsideClock_mobilephone.png",
    "Terrarium Globe":           "TerrariumGlobe_lightbulb.png",
    "Mini Oil Lamp":             "MiniOilLamp_lightbulb.png",
    "Hanging Bud Vase":          "HangingBudVase_lightbulb.png",
    "Produce Bag":               "ProduceBag_shirts.png",
    "Dog Rope Toy":              "DogRopeToy_shirts.png",
    "Hair Scrunchies":           "HairScrunchies_shirts.png",
    "First Aid Kit":             "FirstAidKit_plasticbox.png",
    "Drawer Dividers":           "DrawerDividers_plasticbox.png",
    "Cable Tidy":                "CableTidy_plasticbox.png",
    "Cat Scratcher":             "CatScratcher_cardboardbox.png",
    "Laptop Stand":              "LaptopStand_cardboardbox.png",
    "Storage Bins":              "StorageBins_cardboardbox.png",
    "Cable Springs":             "CableSprings_pens.png",
    "Garden Sprinkler":          "GardenSprinkler_pens.png",
    "Plant Support Stakes":      "PlantSupportStakes_pens.png",
    "Garden Markers":            "GardenMarkers_pencil.png",
    "Pencil Disk Jewelry":       "PencilDiskJewelry_pencils.png",
    "Keyboard & Screen Cleaner": "Keyboard&ScreenCleaner_pencils.png",
    "Fence or Wall Planter":     "FenceorWallPlanter_shoes.png",
    "Weighted Door Stop":        "WeightedDoorStop_shoes.png",
    "Hallway Key Holder":        "HallwayKeyHolder_shoes.png",
    "Wall Shelf from Drawer":    "WallShelffromDrawer_woodenfurniture.png",
    "Coat Rack from Chair Back": "CoatRackfromChairBack_woodenfurniture.png",
    "Garden Bench from Table":   "GardenBenchfromTable_woodenfurniture.png",
    "Reusable Cleaning Rags":    "ReusableCleaningRags_housetextile.png",
    "Sturdy Tote Bag":           "SturdyToteBag_housetextile.png",
    "Door Draft Stopper":        "DoorDraftStopper_housetextile.png",
};

document.addEventListener('DOMContentLoaded', () => {
    // tjanet dannie
    const params = new URLSearchParams(window.location.search);
    const itemName = params.get('item')?.toLowerCase() || localStorage.getItem('currentItem') || "plastic bottle";
    const itemData = itemDatabase[itemName];
    const selectedMatName = localStorage.getItem('selectedMaterial');

    if (!itemData) {
        console.error("Item not found in database");
        return;
    }

    // 2. dlja kartinki
    const mainImg = document.getElementById('itemImage'); 
    if (mainImg && itemData.image) {
        mainImg.src = itemData.image;
        mainImg.alt = itemName;
    }

    // 3. dlja filtertags
    const tagsEl = document.getElementById('filterTags');
    if (tagsEl) {
        // dlja abbreviation
        let material = null;
        if (itemData.group && selectedMatName) {
            material = materialGroups[itemData.group].find(m => m.name === selectedMatName);
        }

        // dlja yes/no otvetiv
        const userChoiceTag = localStorage.getItem('userChoiceTag') || null;

        // dlja tags aray tipo
        const tags = [
            itemName,
            material ? `${material.abbr} — ${material.name}` : null,
            userChoiceTag
        ].filter(Boolean);

        tagsEl.innerHTML = ''; 

        tags.forEach((t, i) => {
            const tag = document.createElement('span');
            tag.className = `filter-tag anim-item d${i+1}`;
            tag.innerHTML = `${t.toUpperCase()} <span class="rm">✕</span>`;
            
            tag.querySelector('.rm').addEventListener('click', () => {
                tag.style.opacity = '0';
                setTimeout(() => tag.remove(), 300);
            });
            
            tagsEl.appendChild(tag);
        });
    }

    // 4. dlja diy kartochek
    const cards = [
        document.getElementById('diy-0'),
        document.getElementById('diy-1'),
        document.getElementById('diy-2')
    ];

    if (itemData.diys) {
        itemData.diys.forEach((project, index) => {
            if (cards[index]) {
                const imgFile = diyImages[project.name];
                const imgTag = imgFile
                    ? `<img class="diy-card-img" src="images/${imgFile}" alt="${project.name}">`
                    : '';
                cards[index].innerHTML = `
                    <div class="card-clip">
                        <div class="idea-content">
                            <div class="idea-title">${project.name}</div>
                            <div class="idea-needs">${project.needs}</div>
                            <div class="idea-steps">
                                ${project.steps.map(step => `<div>${step}</div>`).join("")}
                            </div>
                        </div>
                    </div>
                    ${imgTag}
                `;
                cards[index].onclick = () => toggleCardImage(cards[index], cards);
            }
        });
    }

    // 5. calculjator
    const plusBtn    = document.getElementById('calcQtyPlus');
    const minusBtn   = document.getElementById('calcQtyMinus');
    const qtyDisplay = document.getElementById('calcQtyDisplay');
    let qty = 1;

    const updateStats = () => {
        document.getElementById('saveWater').innerText  = (qty * itemData.savings.water).toFixed(1);
        document.getElementById('saveEnergy').innerText = (qty * itemData.savings.energy).toFixed(1);
        document.getElementById('saveCO2').innerText    = (qty * itemData.savings.co2).toFixed(1);
    };

    if (plusBtn) {
        plusBtn.addEventListener('click', () => {
            qty++;
            if (qtyDisplay) qtyDisplay.innerText = qty;
            updateStats();
        });
    }
    if (minusBtn) {
        minusBtn.addEventListener('click', () => {
            if (qty > 1) { qty--; if (qtyDisplay) qtyDisplay.innerText = qty; updateStats(); }
        });
    }
    updateStats();
});

// modalnije funkcii
function showModal(project) {
    const modal = document.getElementById('diyModal');
    if (!modal) return;
    document.getElementById('modalTitle').innerText = project.name;
    document.getElementById('modalNeeds').innerText = project.needs;
    const stepsList = document.getElementById('modalSteps');
    stepsList.innerHTML = project.steps.map(s => `<li>${s}</li>`).join('');
    modal.style.display = "block";
}

function closeModal() {
    document.getElementById('diyModal').style.display = "none";
}

window.onclick = function(event) {
    const modal = document.getElementById('diyModal');
    if (event.target === modal) { modal.style.display = "none"; }
    };

/* ── Card image expand on click ─────────────────────────── */
function toggleCardImage(clickedCard, allCards) {
    const isExpanded = clickedCard.classList.contains('card-img-expanded');
    allCards.forEach(c => c && c.classList.remove('card-img-expanded'));
    if (!isExpanded) clickedCard.classList.add('card-img-expanded');
}