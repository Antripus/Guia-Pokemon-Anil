// Path JSON
const jsonPath = "./data/Z/pokemon.json";

// DOM refs (asegúrate de que en tu HTML exista #type-filter-grid y #type-match-all)
const pokemonListElement = document.getElementById("pokemon-list");
const searchInput = document.getElementById("search-bar");
const typeFilterGrid = document.getElementById("type-filter-grid"); // contenedor de botones por tipo
const typeMatchAllCheckbox = document.getElementById("type-match-all"); // checkbox: requiere match ALL (AND)
const sortSelect = document.getElementById("sort-select");
const clearFiltersBtn = document.getElementById("clear-filters");
const toggleFavsBtn = document.getElementById("toggle-favs");
const resultCountEl = document.getElementById("result-count");

const typeColors = {
  Grass: "#78C850", Poison: "#AC66C8", Fire: "#F08030", Water: "#6890F0",
  Bug: "#A8B820", Normal: "#A8A878", Electric: "#F8D030", Ground: "#E0C068",
  Psychic: "#F85888", Rock: "#B8A038", Ice: "#98D8D8", Dragon: "#7038F8",
  Dark: "#705848", Fairy: "#EE99AC", Fighting: "#C03028", Flying: "#A890F0",
  Ghost: "#705898", Steel: "#B8B8D0"
};

let allPokemon = [];
let filteredPokemon = [];
let selectedTypes = new Set();           // tipos seleccionados por la grilla
let showOnlyFavs = false;

const FAV_KEY = "pokedex_favorites_v1";
const debounceDelay = 220;

// Debounce util
function debounce(fn, delay) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

// LocalStorage favorites helpers
function getFavorites() {
  try {
    const raw = localStorage.getItem(FAV_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function toggleFavorite(number) {
  const favs = new Set(getFavorites());
  if (favs.has(number)) favs.delete(number); else favs.add(number);
  localStorage.setItem(FAV_KEY, JSON.stringify(Array.from(favs)));
  applyFiltersAndRender();
}
function isFavorite(number) {
  return getFavorites().includes(number);
}

// Load data
async function loadPokemon() {
  try {
    const res = await fetch(jsonPath);
    allPokemon = await res.json();

    // ensure number000
    allPokemon.forEach(p => {
      if (!p.number000) p.number000 = String(p.number).padStart(3, "0");
    });

    // build type grid from data
    const allTypes = new Set();
    allPokemon.forEach(p => (p.type || []).forEach(t => allTypes.add(t)));
    createTypeFilterGrid(Array.from(allTypes).sort());

    applyFiltersAndRender();
  } catch (e) {
    console.error("Error loading Pokémon data:", e);
  }
}

/* ---------------------------
   TYPE FILTER GRID (buttons)
   --------------------------- */
function createTypeFilterGrid(types) {
  if (!typeFilterGrid) return;
  typeFilterGrid.innerHTML = "";

  types.forEach(typeName => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "type-filter-btn";
    btn.dataset.type = typeName;
    btn.setAttribute("aria-pressed", "false");
    // inner pill (usa inline style con color para mantener tu paleta)
    btn.innerHTML = `<span class="type-pill" style="background:${typeColors[typeName] || '#999'}">${typeName}</span>`;
    btn.addEventListener("click", (ev) => {
      ev.preventDefault();
      toggleTypeSelection(typeName, btn);
      applyFiltersAndRender();
    });
    typeFilterGrid.appendChild(btn);
  });
}

// togglear tipo (visualmente y en el Set)
function toggleTypeSelection(typeName, btnEl = null) {
  if (selectedTypes.has(typeName)) {
    selectedTypes.delete(typeName);
    if (btnEl) {
      btnEl.classList.remove("active");
      btnEl.setAttribute("aria-pressed", "false");
    }
  } else {
    selectedTypes.add(typeName);
    if (btnEl) {
      btnEl.classList.add("active");
      btnEl.setAttribute("aria-pressed", "true");
    }
  }
}

/* ---------------------------
   APPLY FILTERS & RENDER
   --------------------------- */
function applyFiltersAndRender() {
  const q = searchInput ? searchInput.value.trim().toLowerCase() : "";
  const sortBy = sortSelect ? sortSelect.value : "number_asc";
  const requireAllTypes = !!(typeMatchAllCheckbox && typeMatchAllCheckbox.checked); // modo AND si está chequeado

  filteredPokemon = allPokemon.filter(p => {
    // favoritos
    if (showOnlyFavs && !isFavorite(p.number)) return false;

    // búsqueda por nombre o número
    if (q) {
      const byName = (p.name || "").toLowerCase().includes(q);
      const byNumber = String(p.number).includes(q);
      if (!byName && !byNumber) return false;
    }

    // tipos: si hay tipos seleccionados, aplicar filtro OR (por defecto) o AND (si requireAllTypes true)
    if (selectedTypes.size > 0) {
      const pTypes = (p.type || []);
      if (requireAllTypes) {
        // todos los seleccionados deben estar en pTypes
        const allMatch = Array.from(selectedTypes).every(st => pTypes.includes(st));
        if (!allMatch) return false;
      } else {
        // al menos uno coincide (OR)
        const anyMatch = pTypes.some(t => selectedTypes.has(t));
        if (!anyMatch) return false;
      }
    }

    return true;
  });

  // ordenar
  filteredPokemon.sort((a, b) => {
    switch (sortBy) {
      case "number_asc": return a.number - b.number;
      case "number_desc": return b.number - a.number;
      case "name_asc": return a.name.localeCompare(b.name);
      case "name_desc": return b.name.localeCompare(a.name);
      case "total_desc": return (b.base_stats?.total || 0) - (a.base_stats?.total || 0);
      case "total_asc": return (a.base_stats?.total || 0) - (b.base_stats?.total || 0);
      default: return a.number - b.number;
    }
  });

  renderPokemonList(filteredPokemon);
  updateResultCount(filteredPokemon.length);
}

/* ---------------------------
   RENDER LIST
   --------------------------- */
function renderPokemonList(list) {
  pokemonListElement.innerHTML = "";
  const frag = document.createDocumentFragment();

  list.forEach(pokemon => {
    const item = document.createElement("div");
    item.className = "pokemon-item";

    // Build inner card markup
    item.innerHTML = `
      <div class="pokemon-card">
        <div class="card-head" style="display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex;gap:8px;align-items:center;">
            <span class="pokemon-counter">#${pokemon.number}</span>
            <div class="pkm-name" style="font-weight:700">${pokemon.name}</div>
          </div>
          <button class="fav-btn" data-num="${pokemon.number}" title="Favorito" style="background:none;border:none;font-size:18px;cursor:pointer;">
            ${isFavorite(pokemon.number) ? "★" : "☆"}
          </button>
        </div>

        <div style="display:flex;flex-direction:column;align-items:center;gap:8px;padding:8px 0;">
          <img class="pkm-thumb" src="./images/Z/pokemon/${pokemon.number000}.png" alt="${pokemon.name}" loading="lazy" style="cursor:pointer;">
          <div class="types">
            ${(pokemon.type || []).map(t => `<span class="type" style="background:${typeColors[t] || '#999'}">${t}</span>`).join(" ")}
          </div>
        </div>
      </div>
    `;

    // Click SOLO en la imagen para abrir detalles
    const img = item.querySelector(".pkm-thumb");
    img && img.addEventListener("click", (ev) => {
      ev.stopPropagation(); // evitar que el click recorra el item
      window.open(`Z-pokemon-details.html?number=${pokemon.number}`, '_blank');
    });

    // Favorito (click en estrella)
    item.querySelector(".fav-btn")?.addEventListener("click", (ev) => {
      ev.stopPropagation();
      toggleFavorite(pokemon.number);
    });

    frag.appendChild(item);
  });

  pokemonListElement.appendChild(frag);
}

function updateResultCount(n) {
  if (!resultCountEl) return;
  resultCountEl.textContent = `${n} Pokémon`;
}

/* ---------------------------
   EVENTS
   --------------------------- */
const debouncedFilter = debounce(() => applyFiltersAndRender(), debounceDelay);
if (searchInput) searchInput.addEventListener("input", debouncedFilter);
if (sortSelect) sortSelect.addEventListener("change", () => applyFiltersAndRender());

if (clearFiltersBtn) clearFiltersBtn.addEventListener("click", () => {
  if (searchInput) searchInput.value = "";
  // limpiar selección de tipos visualmente y en el Set
  selectedTypes.clear();
  document.querySelectorAll("#type-filter-grid .type-filter-btn.active").forEach(b => b.classList.remove("active"));
  // desactivar checkbox de match-all si existe
  if (typeMatchAllCheckbox) typeMatchAllCheckbox.checked = false;
  if (sortSelect) sortSelect.value = "number_asc";
  showOnlyFavs = false;
  if (toggleFavsBtn) toggleFavsBtn.textContent = "Ver favoritos";
  applyFiltersAndRender();
});

if (toggleFavsBtn) toggleFavsBtn.addEventListener("click", () => {
  showOnlyFavs = !showOnlyFavs;
  toggleFavsBtn.textContent = showOnlyFavs ? "Ver todos" : "Ver favoritos";
  applyFiltersAndRender();
});

// checkbox change -> re-render
if (typeMatchAllCheckbox) {
  typeMatchAllCheckbox.addEventListener("change", () => {
    applyFiltersAndRender();
  });
}

// keyboard shortcut for focus on search
document.addEventListener("keydown", (e) => {
  if (e.key === "/") {
    e.preventDefault();
    searchInput && searchInput.focus();
  }
});

// init
loadPokemon();
