// Rutas de los archivos JSON
const jsonPathPokemon = "./data/Anil/pokemon.json";
const jsonPathEncuentros = "./data/Anil/encounters.json";
const jsonPathCoordinates = "./data/Anil/coordinates.json";

// Elementos del DOM
const zonaSelect = document.getElementById("zona-select");
const encountersList = document.getElementById("encounters-list");
const zoneMarker = document.getElementById("zone-marker");
const searchBar = document.getElementById("search-bar"); 

// Coordenadas del mapa (basadas en los números de las zonas)
let zoneCoordinates = {};

// Estado global para la dificultad seleccionada
let selectedDifficulty = "Completo"; // Valor por defecto



// Función para cargar el archivo `pokemon.json`
async function loadPokemon() {
    try {
        const response = await fetch(jsonPathPokemon);
        const pokemonData = await response.json();
        sessionStorage.setItem("pokemonData", JSON.stringify(pokemonData)); // Guarda en sessionStorage
    } catch (error) {
        console.error("Error loading Pokémon data:", error);
    }
}

// Función para cargar el archivo `encounters.json`
async function loadEncuentros() {
    try {
        const response = await fetch(jsonPathEncuentros);
        const encuentrosData = await response.json();
        sessionStorage.setItem("encuentrosData", JSON.stringify(encuentrosData)); // Guarda en sessionStorage
    } catch (error) {
        console.error("Error loading Encounters data:", error);
    }
}

// 1. Función para cargar coordenadas desde JSON
async function loadCoordinates() {
    try {
        const response = await fetch(jsonPathCoordinates);
        zoneCoordinates = await response.json();
    } catch (error) {
        console.error("Error loading coordinates data:", error);
    }
}

// Función para actualizar la dificultad seleccionada
function updateDifficulty(difficulty) {
    selectedDifficulty = difficulty;
    const selectedZonaNumber = zonaSelect.value;
    const encuentrosData = JSON.parse(sessionStorage.getItem("encuentrosData"));
    const selectedZona = encuentrosData.find(
        (zona) => zona.nro_zona === selectedZonaNumber
    );

    if (selectedZona) {
        displayEncounters(selectedZona);
    }
}

// 3. Función para poblar el `<select>` de zonas con los números de zona
function populateZonaSelect(encuentrosData) {
    zonaSelect.innerHTML = encuentrosData
        .map(
            (zona) =>
                `<option value="${zona.nro_zona}">${zona.nombre_zona} (NroZona: ${zona.nro_zona})</option>`
        )
        .join("");

    if (encuentrosData.length > 0) {
        const defaultZona = encuentrosData[0];
        displayEncounters(defaultZona);
        updateZoneMarker(defaultZona.nro_zona);
    }
}

// Función para filtrar las opciones de la barra de búsqueda
function filterZonaOptions(query, encuentrosData) {
    const filtered = encuentrosData.filter((zona) =>
        zona.nombre_zona.toLowerCase().includes(query.toLowerCase())
    );
    populateZonaSelect(filtered);
}

// Función para buscar un Pokémon por nombre en pokemonData
function findPokemonByName(name, pokemonData) {
    return pokemonData.find(pokemon => pokemon.internal_name.toLowerCase() === name.toLowerCase());
}

// Modificar la función displayEncounters para aplicar el filtro
function displayEncounters(zona) {
    const typeIcons = {
        Land: './images/land3.png',
        LandClassic: './images/land3.png',
        Water: './images/water3.png',
        WaterClassic: './images/water3.png',
        OldRod: './images/rod2.png',
        OldRodClassic: './images/rod2.png',
    };

    const typeDefinition = {
        Land: 'Hierba / Cueva', //[Modo Completo y Radical]
        LandClassic: 'Hierba / Cueva', //[Modo Clasico]
        Water: 'Agua',
        WaterClassic: 'Agua',
        OldRod: 'Old Rod',
        OldRodClassic: 'Old Rod',
    };

    const pokemonData = JSON.parse(sessionStorage.getItem("pokemonData"));

    // Definir los tipos permitidos según la dificultad seleccionada
    const allowedTypes = {
        Completo: ["Land", "Water", "OldRod"],
        Clasico: ["LandClassic", "WaterClassic", "OldRodClassic"],
        Radical: ["Land", "Water", "OldRod"], // Ajusta según las reglas del modo Radical
    }[selectedDifficulty];

    const encounterTypes = Object.keys(zona.encounters).filter((type) =>
        allowedTypes.includes(type)
    );

    encountersList.innerHTML = encounterTypes
        .map((type) => {
            const encounters = zona.encounters[type]
            .map((enc) => {
                // Buscar información del Pokémon usando findPokemonByName
                const pokemon = findPokemonByName(enc.pokemon, pokemonData);
                if (!pokemon) {
                    console.warn(`Pokémon ${enc.pokemon} not found in pokemonData.`);
                }
    
                const pokemonImage = pokemon
                    ? `./images/pokemon/${pokemon.internal_name}.png`
                    : './images/pokemon/000.png'; // Imagen predeterminada si no se encuentra el Pokémon
    
                return `
                <div class="encounter-card">
                    <h3>${pokemon.name}</h3>
                    
                    <a href="/Opalo-pokemon-details.html?name=${enc.pokemon.toLowerCase()}" target="_blank">
                        <img src="${pokemonImage}" alt="${enc.pokemon.toLowerCase()}">
                    </a>
                    
                    <p>Nivel: ${enc.min_level} - ${enc.max_level}</p>
                </div>
                `;
            })
            .join("");



            const icon = typeIcons[type] || '';
            const definition = typeDefinition[type] || '';

            return `
                <div class="encounter-group">
                    <div class="tipoEncuentro">
                        <h2><img src="${icon}" alt="${type}" class="icon">${definition}</h2>
                    </div>
                    <div class="encounters">${encounters}</div>
                </div>
            `;
        })
        .join("");

        
}

// 5. Función para actualizar el marcador en el mapa
function updateZoneMarker(zoneNumber) {
    console.log("Updating marker for zone:", zoneNumber);
    const zone = zoneCoordinates[zoneNumber];
    if (zone) {
        zoneMarker.style.left = `${zone.x}px`;
        zoneMarker.style.top = `${zone.y}px`;
        zoneMarker.style.display = "block";
    } else {
        console.warn(`No coordinates found for zone: ${zoneNumber}`);
        zoneMarker.style.display = "none";
    }
}

// 6. Función para inicializar el marcador y cargar datos iniciales
function initializeZoneMarker(encuentrosData) {
    populateZonaSelect(encuentrosData);

    const defaultZonaId = encuentrosData[0]?.nro_zona || Object.keys(zoneCoordinates)[0];
    if (defaultZonaId) {
        updateZoneMarker(defaultZonaId);
    } else {
        console.error("No default zone ID found to initialize the marker.");
    }
}

// 7. Función principal para inicializar la aplicación
async function init() {
    await loadPokemon();
    await loadEncuentros();
    await loadCoordinates();

    const encuentrosData = JSON.parse(sessionStorage.getItem("encuentrosData"));
    
    if (encuentrosData) {
        initializeZoneMarker(encuentrosData);

        // Conectar la barra de búsqueda
        searchBar.addEventListener("input", (e) => {
            const query = e.target.value;
            filterZonaOptions(query, encuentrosData);
        });

        // Agregar eventos a los botones de dificultad
        document.querySelectorAll(".toggle-buttons input").forEach((button) => {
            button.addEventListener("change", (e) => {
                updateDifficulty(e.target.value);
            });
        });
    } else {
        console.error("No encounters data found in sessionStorage.");
    }
}

// 8. Eventos
zonaSelect.addEventListener("change", () => {
    const selectedZonaNumber = zonaSelect.value;
    console.log("selectedzone number: "+selectedZonaNumber);
    const encuentrosData = JSON.parse(sessionStorage.getItem("encuentrosData"));
    const selectedZona = encuentrosData.find(
        (zona) => zona.nro_zona === selectedZonaNumber
    );

    if (selectedZona) {
        displayEncounters(selectedZona);

        console.log("2-selectedzone number: "+selectedZonaNumber);
        updateZoneMarker(selectedZonaNumber);
    } else {
        console.error("Selected zone not found:", selectedZonaNumber);
    }
});

document.addEventListener("DOMContentLoaded", init);
