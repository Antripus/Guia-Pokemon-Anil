
// Ruta de los archivos JSON
const jsonPathPokemon = "./data/Z/pokemon.json";
const jsonPathMoves = "./data/Z/moves.json";
const jsonPathAbilities = "./data/Z/abilities.json";
const jsonPathEncounters = "./data/Z/encounters.json";
const jsonPathTypes = "./data/Z/types.json";

const jsonPathMegas = "./data/Z/megas.json";

// Elementos del DOM
const pkmGrid = document.getElementById("pkmGrid");

//seteo inicial
const params = new URLSearchParams(window.location.search);
const pokemonNumber = params.get('number') ? parseInt(params.get('number'), 10) : null;
const pokemonName = params.get('name') ? params.get('name').toLowerCase().replace('.html', '') : null;

function padNumber(num, size = 3) {
  return String(num).padStart(size, '0');
}


const typeColors = {
  Grass: "#78C850",
  Poison: "#AC66C8",
  Fire: "#F08030",
  Water: "#6890F0",
  Bug: "#A8B820",
  Normal: "#A8A878",
  Electric: "#F8D030",
  Ground: "#E0C068",
  Psychic: "#F85888",
  Rock: "#B8A038",
  Ice: "#98D8D8",
  Dragon: "#7038F8",
  Dark: "#705848",
  Fairy: "#EE99AC",
  Fighting: "#C03028",
  Flying: "#A890F0",
  Ghost: "#705898",
  Steel: "#B8B8D0"
};

// Colores para cada tipo de Pokémon
const BarColors = {
  HP: "#78C850",
  ATTACK: "#F08030",
  DEFENSE: "#F08030",
  SPEED: "#A8B820",
  Normal: "#A8A878",
  SP_ATTACK: "#F8D030",
  SP_DEFENSE: "#F8D030",
};

const ShortStats = {
  HP: "HP",
  ATTACK: "Atk",
  DEFENSE: "Def",
  SPEED: "Spe",
  SP_ATTACK: "SpA",
  SP_DEFENSE: "SpD",
};



async function loadPokemonDetails() {
  try {
    const response = await fetch(jsonPathPokemon);
    const pokemonData = await response.json();

    // NORMALIZAR number000 para cada entrada (ej. 006, 142, etc.)
    pokemonData.forEach(p => {
      if (!p.number000) {
        p.number000 = padNumber(p.number);
      }
    });

    // Buscar Pokémon según número o nombre
    const pokemon = pokemonNumber
      ? pokemonData.find(p => p.number === pokemonNumber)
      : pokemonData.find(p => p.name.toLowerCase() === pokemonName);
    console.log(pokemonName);
    console.log(pokemonNumber);
    if (!pokemon) {
      pkmGrid.innerHTML = `<p>Pokémon no encontrado</p>`;
      return;
    }

    sessionStorage.setItem("pokemonData", JSON.stringify(pokemonData)); // Guardar en memoria para acceso rápido

    // Buscar Pokémon anterior y posterior
    let preNumber = pokemon.number - 1;
    let postNumber = pokemon.number + 1;

    // Asegurarse de que los números están en rango
    preNumber = checkNumberBounds(preNumber, pokemonData.length);
    postNumber = checkNumberBounds(postNumber, pokemonData.length);

    const prePokemon = pokemonData.find(p => p.number === preNumber);
    const postPokemon = pokemonData.find(p => p.number === postNumber);

    // Guardamos la referencia base (no modif) para poder volver
    // Asegurar que el objeto base actual tenga number000 y guardarlo para poder volver
    if (!pokemon.number000) pokemon.number000 = padNumber(pokemon.number);
    sessionStorage.setItem("currentBasePokemon", JSON.stringify(pokemon));


    displayPokemonDetails(pokemon, prePokemon, postPokemon);
  } catch (error) {
    console.error("Error al cargar detalles del Pokémon:", error);
  }
}


// Función para cargar  megas.JSON
  async function loadMegas() {
    try {
      const response = await fetch(jsonPathMegas);
      const megasData = await response.json();
      sessionStorage.setItem("megasData", JSON.stringify(megasData));
    } catch (error) {
      console.error("Error loading Megas data:", error);
    }
  }

    // Función para cargar el moves.JSON
  async function loadMoves() {
    try {
      const response = await fetch(jsonPathMoves);
      const movesData = await response.json();
      sessionStorage.setItem("movesData", JSON.stringify(movesData)); // Almacena los datos en sessionStorage
    } catch (error) {
      console.error("Error loading Moves data:", error);
    }
  }

  // Función para cargar el encounters.JSON
  async function loadEncounters() {
    try {
      const response = await fetch(jsonPathEncounters);
      const encountersData = await response.json();
      sessionStorage.setItem("encountersData", JSON.stringify(encountersData)); // Almacena los datos en sessionStorage
    } catch (error) {
      console.error("Error loading Encounters data:", error);
    }
  }

  // Función para cargar el abilities.JSON
  async function loadAbilities() {
    try {
      const response = await fetch(jsonPathAbilities);
      const abilitiesData = await response.json();
      sessionStorage.setItem("abilitiesData", JSON.stringify(abilitiesData)); // Almacena los datos en sessionStorage
    } catch (error) {
      console.error("Error loading Abilities data:", error);
    }
  }

    // Función para cargar el types.JSON
    async function loadTypes() {
      try {
        const response = await fetch(jsonPathTypes);
        const typesData = await response.json();
        sessionStorage.setItem("typesData", JSON.stringify(typesData)); // Almacena los datos en sessionStorage
      } catch (error) {
        console.error("Error loading Types data:", error);
      }
    }

  function checkNumberBounds(number, maxNumber) {
    if (number < 1) return 1;
    if (number > maxNumber) return maxNumber;
    return number;
  }

  function capitalizeFirstWord(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  function calculateTypeInteractions(types, typesData) {
    const interactions = {
        weaknesses: [],
        resistances: [],
        immunities: []
    };
    console.log ("TIPOS: "+types);
    types.forEach((type) => {
      console.log ("TIPO: "+type);
      
        const typeInfo = typesData.find(t => t.internalname === type.toUpperCase());
        if (typeInfo) {
            // Agregar debilidades, resistencias e inmunidades
            console.log ("TIPO: "+typeInfo);
            interactions.weaknesses.push(...(typeInfo.weaknesses || []));
            interactions.resistances.push(...(typeInfo.resistances || []));
            interactions.immunities.push(...(typeInfo.immunities || []));
        }
    });
  
    // Eliminar interacciones duplicadas y resolver conflictos
    interactions.weaknesses = interactions.weaknesses.filter(weakness => {
        return !interactions.resistances.includes(weakness) && !interactions.immunities.includes(weakness);
    });
  
    interactions.resistances = [...new Set(interactions.resistances.filter(resistance => {
        return !interactions.immunities.includes(resistance);
    }))];
  
    interactions.immunities = [...new Set(interactions.immunities)];
  
    return interactions;
  }
  
  // Función para generar HTML de debilidades, inmunidades y resistencias
  function generateTypeInteractionsHTML(pokemon, typesData) {
    const { weaknesses, resistances, immunities } = calculateTypeInteractions(pokemon.type, typesData);
  
    // Generar HTML para debilidades
    const debilidadesHTML = weaknesses.length > 0
        ? weaknesses.map(w => `<p class="type" style="background-color: ${typeColors[capitalizeFirstWord(w)] || "#000"};">${capitalizeFirstWord(w)}</p>`).join("")
        : "<p>Sin debilidades</p>";
  
    // Generar HTML para inmunidades
    const inmunidadesHTML = immunities.length > 0
        ? immunities.map(i => `<p class="type" style="background-color: ${typeColors[capitalizeFirstWord(i)] || "#000"};">${capitalizeFirstWord(i)}</p>`).join("")
        : "<p>Sin inmunidades</p>";
  
    // Generar HTML para resistencias
    const resistenciasHTML = resistances.length > 0
        ? resistances.map(r => `<p class="type" style="background-color: ${typeColors[capitalizeFirstWord(r)] || "#000"};">${capitalizeFirstWord(r)}</p>`).join("")
        : "<p>Sin resistencias</p>";
  
    return { debilidadesHTML, inmunidadesHTML, resistenciasHTML };
  }


// Esta función transforma un objeto "mega" de tu JSON a un objeto compatible con displayPokemonDetails()
// Usamos base_number como número, y rellenamos number000.
// Hacemos que el objeto resultante tenga number, number000 (incluyendo sufijo _1/_2 si corresponde)
function makeMegaAsPokemon(mega, variantIndex = 1) {
  const baseNum = mega.base_number || 0;
  const numPadded = padNumber(baseNum, 3);
  const number000 = `${numPadded}_${variantIndex}`; // ej "006_1"
  const wrapper = {
    number: baseNum,
    number000,
    name: mega.name || `Mega-${baseNum}`,
    type: mega.type || [],
    base_stats: mega.base_stats || { hp:0, attack:0, defense:0, speed:0, sp_attack:0, sp_defense:0, total:0 },
    base_exp: mega.base_exp || 0,
    abilities: mega.abilities || [],
    hidden_ability: mega.hidden_ability || null,
    moves: mega.moves || [],
    form: mega.form || "Mega",
    // copia otros campos útiles
    tipo: mega.tipo || null,
    megapiedra: mega.megapiera || mega.megapiedra || null,
    ubicacionMegaPiedra: mega.ubicacionMegaPiedra || null,
    _rawMegaObject: mega // por si quieres acceder al original
  };
  return wrapper;
}


function displayPokemonDetails(pokemon, prePokemon, postPokemon) {
  const typeHTML = pokemon.type
    .map(
      (type) =>
        `
      <p class="type" style="background-color: ${typeColors[type] || "#000"};">${type}</p>
      `
    )
    .join(" ");



  // Obtener el valor máximo de los stats (excluyendo 'total' para no tener barra)
  const statsWithoutTotal = Object.entries(pokemon.base_stats).filter(
    ([stat]) => stat !== "total"
  );
  const maxStatValue = 170 //Math.max(...statsWithoutTotal.map(([stat, value]) => value));


  // Manejo de las barras de estadísticas base
  const statsHTML = statsWithoutTotal
    .map(
      ([stat, value]) =>
        `<div class="grid" >
        <p class="label">${ShortStats[stat.toUpperCase()]}</p>
        <p class="statVal">${value}</p>
        <div class="bar" style="width: ${(value / maxStatValue) * 100
        }%; background-color: ${BarColors[stat.toUpperCase()] || "#cc2c"};"></div>
        </div>`
    )
    .join("");


  // Mostrar el stat total sin barra
  const totalHTML = pokemon.base_stats.total
    ? `<div class="grid">
        <p class="label">TOTAL</p>
        <p class="label">${pokemon.base_stats.total}</p>
        </div>`
    : "";

  //agarro los json de memoria
  const abilitiesData = JSON.parse(sessionStorage.getItem("abilitiesData"));
  const pokemonData = JSON.parse(sessionStorage.getItem("pokemonData"));
  const encountersData = JSON.parse(sessionStorage.getItem("encountersData"));
  const movesData = JSON.parse(sessionStorage.getItem("movesData"));
  const typesData = JSON.parse(sessionStorage.getItem("typesData"));
  const megasData = JSON.parse(sessionStorage.getItem("megasData") || "[]");


  if (!typesData) {
    console.error("typesData no está disponible. Verifica la carga del archivo.");
    return { debilidadesHTML: "<p>Error cargando datos</p>", inmunidadesHTML: "<p>Error cargando datos</p>", resistenciasHTML: "<p>Error cargando datos</p>" };
}

//Obtener Movimientos
  const movesHTML = typeof generateMovesHTML === "function" ? generateMovesHTML(pokemon, movesData) : "";
  const eggsMovesHTML = typeof generateEggsMovesHTML === "function" ? generateEggsMovesHTML(pokemon, movesData) : "";
  const TMsMovesHTML = typeof generateTMsMovesHTML === "function" ? generateTMsMovesHTML(pokemon, movesData) : "";
  
//Obtener ubicaciones
  const ubicacionesHTML = typeof generateUbicacionHTML === "function" ? generateUbicacionHTML(pokemon.name, encountersData) : "";
  
// Obtener habilidades
  const abilitiesHTML = getAbilitiesHTML(pokemon, abilitiesData);
  
//Obtener cadena de Evoluciones
  const evolutionChain = typeof getEvolutionChain === "function" ? getEvolutionChain(pokemon.name, pokemonData) : [];
  const EvolucionesHTML = typeof generateEvolutionHTML === "function" ? generateEvolutionHTML(evolutionChain, pokemonData) : "";
  
  
//Obterneer las relaciones de tipos
  const { debilidadesHTML, inmunidadesHTML, resistenciasHTML } = generateTypeInteractionsHTML(pokemon, typesData);


  /*Obtener Movimientos
  const movesHTML = generateMovesHTML(pokemon, movesData);

  const eggsMovesHTML = generateEggsMovesHTML(pokemon, movesData);

  const TMsMovesHTML = generateTMsMovesHTML(pokemon, movesData);

  //Obtener ubicaciones
  const ubicacionesHTML = generateUbicacionHTML(pokemon.name, encountersData);

  // Obtener habilidades
  const abilitiesHTML = getAbilitiesHTML(pokemon,abilitiesData);


  //Obtener cadena de Evoluciones
  const evolutionChain = getEvolutionChain(pokemon.name, pokemonData);
  const EvolucionesHTML = generateEvolutionHTML(evolutionChain, pokemonData);

  //Obterneer las relaciones de tipos  
  const { debilidadesHTML, inmunidadesHTML, resistenciasHTML } = generateTypeInteractionsHTML(pokemon, typesData);
  */


   // ==== Generar botones de Mega (si existen) ====
  // megasData es un arreglo con tus objetos mega que tiene campo base_number
  // botones de megas: buscamos megas con base_number == pokemon.number
  const baseNumber = pokemon.number;
  const megasForThis = (megasData || []).filter(m => parseInt(m.base_number,10) === parseInt(baseNumber,10));
  let megasButtonsHTML = "";
  if (megasForThis.length > 0) {
    // botón Base con clase .base y sin tooltip (no title)
    megasButtonsHTML += `<button class="mega-button base" data-mega-index="-1">Base</button>`;
    megasForThis.forEach((m, idx) => {
      // agregamos data-* con info para el tooltip: megapiedra, ubicacion
      const megapiedraText = m.megapiera || m.megapiedra || "";
      const ubicacionText = m.ubicacionMegaPiedra || "";
      // idx+1 será el sufijo de imagen: 1,2,...
      megasButtonsHTML += `<button class="mega-button" 
                                data-mega-index="${idx}" 
                                data-mega-img-index="${idx+1}"
                                data-mega-megapiedra="${encodeURIComponent(megapiedraText)}"
                                data-mega-ubicacion="${encodeURIComponent(ubicacionText)}"
                                data-mega-name="${encodeURIComponent(m.name)}"
                                aria-label="${m.name}">
                                ${m.name}
                             </button>`;
    });
  }


  // Si el objeto pokemon trae number000 con sufijo, la imagen será p.ej. "006_1.png". Si no, usamos "006.png".
  const imgSrc = `./images/Z/pokemon/${pokemon.number000 || padNumber(pokemon.number)}.png`;

  pkmGrid.innerHTML = `
    
        <div id="topPanel">
        <a id="goLeft" href=Z-pokemon-details.html?number=${prePokemon.number}> 
          <div class="flex">
            <p>#${prePokemon.number}:</p>
            <img src="/images/Z/pokemon/${prePokemon.number000 || padNumber(prePokemon.number)}.png" class="iconImg">
            <p>${prePokemon.name}</p>
          </div>
        </a>
      
          <h1 id="pkmName">${pokemon.name}</h1>

        <a id="goRight" href=Z-pokemon-details.html?number=${postPokemon.number}> 
          <div class="flex">
            <p>#${postPokemon.number}:</p>
            <img src="/images/Z/pokemon/${postPokemon.number000 || padNumber(postPokemon.number)}.png" class="iconImg">
            <p>${postPokemon.name}</p>
          </div> </a>
        </div>

          <div class="pkmImagen">
                          <div id="tabs">
                ${megasButtonsHTML}
            </div>
            <img id="pkmImg" src="./images/Z/pokemon/${pokemon.number000 || padNumber(pokemon.number)}.png" alt="${pokemon.name}">
   
              
              <div class="type-interactions">
                  <div class="interaction-category">
                      <h3>Debilidades</h3>
                      <div class="types">${debilidadesHTML}</div>
                  </div>
                  <div class="interaction-category">
                      <h3>Inmunidad</h3>
                      <div class="types">${inmunidadesHTML}</div>
                  </div>
                  <div class="interaction-category">
                      <h3>Resistencias</h3>
                      <div class="types">${resistenciasHTML}</div>
                  </div>
              </div>
          </div>



        <div class="tabContent ax active">
        <div class="firstBlock">
            <div class="flex">
               

<p class="label">Species: #${pokemon.number}</p>
            
            </div>
            <div class="flex last">
              
            <div class="typeLabel">
            ${typeHTML}
 
            </div>

            </div>
            
            
        </div>

        <div class="secondBlock">
            <div class="flex">
                
            
              <p class="label">Abilities</p>
  

            </div>

            <div class="flex last">
                <div class="flex last">
                
                <ol>
                <div class="abilities">${abilitiesHTML}</div>
                <ol>
            </div>
            </div>
        </div>

        <div class="thirdBlock">

            <div class="statBlock">  
          ${statsHTML}${totalHTML}
          </div>
        </div>
            
        </div>
    </div>
    
    <div id="evoContent">
      ${EvolucionesHTML}
    </div> 

    <div id="ubicacion">
      ${ubicacionesHTML}        
    </div> 
    <div id="moves">
      ${movesHTML}  
    </div> 
    <div id="eggMoves">
      ${eggsMovesHTML}  
    </div> 
    
    <div id="TMsMoves">
      ${TMsMovesHTML}  
    </div> 


    `;

      // asegurar que al re-renderizar la vista base el botón "Base" quede marcado como activo
  setTimeout(() => {
    // remover .mega-active de cualquier botón y marcar el Base (si existe)
    document.querySelectorAll(".mega-button").forEach(b => b.classList.remove("mega-active"));
    const baseBtn = document.querySelector(".mega-button.base");
    if (baseBtn) baseBtn.classList.add("mega-active");
  }, 0);

}

/* ---------------------
   Reemplaza el listener de click anterior y añade renderMegaPartial()
   --------------------- */

// Función que actualiza sólo las partes relevantes para mostrar una Mega sin tocar evo/moves/ubicación
function renderMegaPartial(megaObj, btnElement = null) {
  // megaObj tiene la misma forma que un "pokemon" (por makeMegaAsPokemon)
  // Actualizar imagen
  const imgEl = document.getElementById("pkmImg");
  if (imgEl) {
    const src = `./images/Z/pokemon/${megaObj.number000 || (padNumber(megaObj.number) + "_1")}.png`;
    imgEl.src = src;
    imgEl.alt = megaObj.name;
  }

  // Actualizar nombre en título principal
  const nameEl = document.getElementById("pkmName");
  if (nameEl) nameEl.textContent = megaObj.name;

  // Actualizar tipos (reemplazar contenido)
  const typeLabelContainer = document.querySelector(".typeLabel");
  if (typeLabelContainer) {
    const typeHTML = (megaObj.type || []).map((t) => `<p class="type" style="background-color: ${typeColors[t] || "#000"};">${t}</p>`).join(" ");
    typeLabelContainer.innerHTML = typeHTML;
  }

  // Actualizar Abilities block
  const abilitiesContainer = document.querySelector(".abilities");
  const abilitiesData = JSON.parse(sessionStorage.getItem("abilitiesData") || "[]");
  if (abilitiesContainer) {
    abilitiesContainer.innerHTML = getAbilitiesHTML(megaObj, abilitiesData);
  }

  // Actualizar estadisticas (solo el bloque statBlock)
  const statBlock = document.querySelector(".statBlock");
  if (statBlock) {
    const statsWithoutTotal = Object.entries(megaObj.base_stats || {}).filter(([stat]) => stat !== "total");
    const maxStatValue = 170;
    const statsHTML = statsWithoutTotal.map(([stat, value]) => `
      <div class="grid">
        <p class="label">${ShortStats[stat.toUpperCase()]}</p>
        <p class="statVal">${value}</p>
        <div class="bar" style="width: ${(value / maxStatValue) * 100}%; background-color: ${BarColors[stat.toUpperCase()] || "#cc2c"};"></div>
      </div>`).join("");
    const totalHTML = megaObj.base_stats && megaObj.base_stats.total ? `<div class="grid"><p class="label">TOTAL</p><p class="label">${megaObj.base_stats.total}</p></div>` : "";
    statBlock.innerHTML = `${statsHTML}${totalHTML}`;
  }

  // Actualizar Base XP (segundo bloque)
  const xpP = Array.from(document.querySelectorAll(".secondBlock .flex p.label")).find(p => p.textContent && p.textContent.startsWith("Base XP"));
  if (xpP) xpP.textContent = `Base XP: ${megaObj.base_exp || 0}`;

  // Resaltar el botón activo (agrega clase .mega-active)
  document.querySelectorAll(".mega-button").forEach(b => b.classList.remove("mega-active"));
  if (btnElement) btnElement.classList.add("mega-active");

  // ----- NUEVO: recalcular y actualizar debilidades/inmunidades/resistencias -----
  try {
    const typesData = JSON.parse(sessionStorage.getItem("typesData") || "[]");
    if (typesData && typeof generateTypeInteractionsHTML === "function") {
      // generateTypeInteractionsHTML espera (pokemon, typesData) y devuelve { debilidadesHTML, inmunidadesHTML, resistenciasHTML }
      const { debilidadesHTML, inmunidadesHTML, resistenciasHTML } = generateTypeInteractionsHTML(megaObj, typesData);

      // Localizamos los contenedores .types dentro de .type-interactions .interaction-category
      // asumimos orden: Debilidades, Inmunidad, Resistencias (como en tu HTML)
      const interactionTypesNodes = document.querySelectorAll(".type-interactions .interaction-category .types");
      if (interactionTypesNodes && interactionTypesNodes.length >= 3) {
        interactionTypesNodes[0].innerHTML = debilidadesHTML;
        interactionTypesNodes[1].innerHTML = inmunidadesHTML;
        interactionTypesNodes[2].innerHTML = resistenciasHTML;
      } else {
        // Fallback: buscar por headings
        const categories = Array.from(document.querySelectorAll(".type-interactions .interaction-category"));
        categories.forEach(cat => {
          const h3 = cat.querySelector("h3");
          const box = cat.querySelector(".types");
          if (!h3 || !box) return;
          const key = h3.textContent.trim().toLowerCase();
          if (key.includes("debil")) box.innerHTML = debilidadesHTML;
          else if (key.includes("inmun")) box.innerHTML = inmunidadesHTML;
          else if (key.includes("resist")) box.innerHTML = resistenciasHTML;
        });
      }
    }
  } catch (e) {
    console.warn("No se pudieron actualizar interacciones de tipo para la Mega:", e);
  }

  // (opcional) Si quieres que el título "Species" muestre algo cuando es Mega, puedes actualizarlo aquí
  const speciesP = Array.from(document.querySelectorAll(".firstBlock .flex p.label")).find(p => p.textContent && p.textContent.startsWith("Species:"));
  if (speciesP) speciesP.textContent = `Species: #${megaObj.number}`;

  // fin de renderMegaPartial
}




// Delegación de clicks para botones mega: Base vuelve a displayPokemonDetails (re-render completo). Megas usan renderMegaPartial.
document.addEventListener("click", (ev) => {
  const t = ev.target;
  if (t.classList && t.classList.contains("mega-button")) {
    const idx = parseInt(t.dataset.megaIndex, 10);
    const basePokemon = JSON.parse(sessionStorage.getItem("currentBasePokemon") || "{}");
    const megasData = JSON.parse(sessionStorage.getItem("megasData") || "[]");
    const megasForThis = (megasData || []).filter(m => parseInt(m.base_number,10) === parseInt(basePokemon.number,10));

    if (idx === -1) {
      // volver a base: re-render completo para restaurar todas las secciones originales
      const pokemonData = JSON.parse(sessionStorage.getItem("pokemonData") || "[]");
      const prePokemon = pokemonData.find(p => p.number === checkNumberBounds(basePokemon.number - 1, pokemonData.length));
      const postPokemon = pokemonData.find(p => p.number === checkNumberBounds(basePokemon.number + 1, pokemonData.length));
      // restauramos el objeto base desde session (currentBasePokemon)
      const baseObj = JSON.parse(sessionStorage.getItem("currentBasePokemon") || "{}");
      // Llamamos a displayPokemonDetails con el objeto base (reconstruye todo)
      displayPokemonDetails(baseObj, prePokemon, postPokemon);
      return;
    }

    const selectedMega = megasForThis[idx];
    if (!selectedMega) return;
    const variantIndex = parseInt(t.dataset.megaImgIndex || (idx+1), 10); // 1,2,...
    const megaObj = makeMegaAsPokemon(selectedMega, variantIndex);

    // En lugar de re-renderizar todo, actualizamos solo secciones clave para la Mega
    renderMegaPartial(megaObj, t);
  }
});


/* ---------------------
   Tooltip para botones mega
   --------------------- */
(function setupMegaTooltip() {
  // crear el div del tooltip si no existe
  let tooltip = document.getElementById("mega-tooltip");
  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.id = "mega-tooltip";
    tooltip.style.position = "fixed";
    tooltip.style.pointerEvents = "none";
    tooltip.style.background = "rgba(0,0,0,0.85)";
    tooltip.style.color = "white";
    tooltip.style.padding = "8px";
    tooltip.style.borderRadius = "6px";
    tooltip.style.fontSize = "13px";
    tooltip.style.zIndex = 9999;
    tooltip.style.display = "none";
    tooltip.style.maxWidth = "300px";
    tooltip.style.boxShadow = "0 2px 8px rgba(0,0,0,0.5)";
    document.body.appendChild(tooltip);
  }

  // show on mouseenter, hide on mouseleave, move on mousemove
  document.addEventListener("mouseover", (ev) => {
    const t = ev.target;
    if (t.classList && t.classList.contains("mega-button")) {
      // no mostrar tooltip para el botón Base o si tiene clase .base
      if (t.dataset.megaIndex === "-1" || t.classList.contains("base")) {
        tooltip.style.display = "none";
        return;
      }
      const name = decodeURIComponent(t.dataset.megaName || "") || t.textContent || "—";
      const megapiedra = decodeURIComponent(t.dataset.megaMegapiedra || "") || "—";
      const ubicacion = decodeURIComponent(t.dataset.megaUbicacion || "") || "—";
      // build content (SIN el campo "Tipo")
      tooltip.innerHTML = `<strong>${name}</strong><br>
                           <small><strong>Mega piedra:</strong> ${megapiedra}</small><br>
                           <small><strong>Ubicación:</strong> ${ubicacion}</small>`;
      tooltip.style.display = "block";
    }
  });
  document.addEventListener("mouseout", (ev) => {
    const t = ev.target;
    if (t.classList && t.classList.contains("mega-button")) {
      tooltip.style.display = "none";
    }
  });
  document.addEventListener("mousemove", (ev) => {
    if (tooltip && tooltip.style.display === "block") {
      const pad = 16;
      let x = ev.clientX + pad;
      let y = ev.clientY + pad;
      // evitar que salga de la pantalla
      const rect = tooltip.getBoundingClientRect();
      if (x + rect.width > window.innerWidth) x = ev.clientX - rect.width - pad;
      if (y + rect.height > window.innerHeight) y = ev.clientY - rect.height - pad;
      tooltip.style.left = `${x}px`;
      tooltip.style.top = `${y}px`;
    }
  });
})();



document.addEventListener("mousemove", (event) => {
  if (event.target.classList.contains("ability-tooltip")) {
    const tooltip = document.getElementById("floating-description");
    const description = event.target.dataset.description;

    tooltip.textContent = description;
    tooltip.style.left = event.pageX + 10 + "px";
    tooltip.style.top = event.pageY + 10 + "px";
    tooltip.style.display = "block";
  } else {
    document.getElementById("floating-description").style.display = "none";
  }
});

document.addEventListener("mousemove", (event) => {
  if (event.target.classList.contains("move-tooltip")) {
    const tooltip = document.getElementById("floating-description-moves");
    const description = event.target.dataset.description;

    tooltip.textContent = description;
    tooltip.style.left = event.pageX + 10 + "px";
    tooltip.style.top = event.pageY + 10 + "px";
    tooltip.style.display = "block";
  } else {
    document.getElementById("floating-description-moves").style.display = "none";
  }
});


// Obtener HTML de habilidades
function getAbilitiesHTML(pokemonDetails, abilitiesData) {
  const allAbilities = [...(pokemonDetails.abilities || [])];
  if (pokemonDetails.hidden_ability) allAbilities.push(pokemonDetails.hidden_ability);
  return allAbilities.map((abilityName) => {
    const ability = abilitiesData.find(a => a.name_en && a.name_en.toLowerCase() === abilityName.toLowerCase());
    return ability ? `<p class="ability-tooltip" data-description="${ability.description}">${ability.name_es}</p>` : `<p>${abilityName}</p>`;
  }).join("");
}

//Obtener Cadena de Evoluciones
// Obtener Cadena de Evoluciones
function getEvolutionChain(pokemonName, pokemonData) {
  // Buscar el Pokémon inicial en la base de datos
  const pokemon = pokemonData.find(p => p.name.toLowerCase() === pokemonName.toLowerCase());
  if (!pokemon) return ["No se encontró el Pokémon"];

  // Inicializar la cadena evolutiva con 3 etapas
  let evolutionChain = Array(3).fill("");

  // Colocar el Pokémon actual en la etapa correspondiente
  evolutionChain[pokemon.evolution_stage - 1] = pokemon.name;
  console.log(evolutionChain);

  // Encontrar pre-evoluciones hacia atrás
  let currentPokemon = pokemon;
  while (currentPokemon.pre_evolution && currentPokemon.pre_evolution !== "Ninguna") {
      const preEvo = pokemonData.find(p => p.name.toLowerCase() === currentPokemon.pre_evolution.toLowerCase());
      if (preEvo) {
          evolutionChain[preEvo.evolution_stage - 1] = preEvo.name;
          currentPokemon = preEvo;
      } else {
          break; // Rompe el bucle si no se encuentra la pre-evolución
      }
  }

  // Encontrar todas las evoluciones posibles hacia adelante
  const findEvolutions = (pokemon) => {
      if (pokemon.evolutions && pokemon.evolutions.length > 0) {
          pokemon.evolutions.forEach(evo => {
              const postEvo = pokemonData.find(p => p.name.toLowerCase() === evo.name.toLowerCase());
              console.log("postEvo: " + postEvo);
              if (postEvo) {
                  evolutionChain[postEvo.evolution_stage - 1] = evolutionChain[postEvo.evolution_stage - 1]
                      ? evolutionChain[postEvo.evolution_stage - 1] + ", " + postEvo.name
                      : postEvo.name;
                  findEvolutions(postEvo); // Recursivamente encontrar evoluciones de la evolución actual
              }
          });
      }
  };

  findEvolutions(pokemon);

  console.log("FINAL: " + evolutionChain[2]);
  return evolutionChain; //Devuelve un arreglo donde en la posicion [0] esta el pokemon etapa 1, [1] estan los pokemon etapa 2 y em [2]estan los pokemon estapa 3
}


// Generar código HTML para cuadro de evoluciones
function generateEvolutionHTML(evolutionChain, pokemonData) {
  // Crear el contenedor principal como cadena HTML
  let evoChainHTML = '<div class="evoChain">';
  const lines = [];

  // Crear contenedores para cada etapa evolutiva
  let etapaEvolutiva1 = '<div class="etapaEvolutiva1">';
  let etapaEvolutiva2 = '<div class="etapaEvolutiva2">';
  let etapaEvolutiva3 = '<div class="etapaEvolutiva3">';

  // Iterar sobre las etapas evolutivas
  ["preMon", "currMon", "postMon"].forEach((className, index) => {
      const stageNames = evolutionChain[index];

      if (stageNames) {
          const stagePokemonNames = stageNames.split(", ");
          stagePokemonNames.forEach(stageName => {
              const stagePokemon = pokemonData.find(p => p.name === stageName);
              if (stagePokemon) {
                  const typeHTML = stagePokemon.type.map(type => `
                      <p class="type" style="background-color: ${typeColors[type] || "#000"};">${type}</p>
                  `).join("");

                  let pokemonHTML = `
                      <div class="${className}">
                          <a href="/Z-pokemon-details.html?number=${stagePokemon.number}" class="pkm ${index === 0 ? "second" : index === 2 ? "first" : ""}" id="${className}-${stagePokemon.name}">
                              <img src="/images/Z/pokemon/${stagePokemon.number000}.png" alt="${stagePokemon.name}" >
                              <p>${stagePokemon.name}</p>
                              <div class="flex">${typeHTML}</div>
                          </a>
                      </div>
                  `;

                  // Agregar el HTML del Pokémon al contenedor correspondiente
                  if (index === 0) {
                      etapaEvolutiva1 += pokemonHTML;
                  } else if (index === 1) {
                      etapaEvolutiva2 += pokemonHTML;
                  } else if (index === 2) {
                      etapaEvolutiva3 += pokemonHTML;
                  }

                  // Agregar líneas de conexión para evoluciones
                  if (index < 2 && stagePokemon.evolutions) {
                      stagePokemon.evolutions.forEach(evo => {
                          const nextStagePokemon = pokemonData.find(p => p.name === evo.name);
                          if (nextStagePokemon) {
                              lines.push({
                                  start: `${className}-${stagePokemon.name}`,
                                  end: `${index === 0 ? 'currMon' : 'postMon'}-${nextStagePokemon.name}`,
                                  method: evo.method,
                                  condition: evo.item_or_condition
                              });
                          }
                      });
                  }
              }
          });
      }
  });

  // Cerrar los contenedores de cada etapa evolutiva
  evoChainHTML += etapaEvolutiva1 + '</div>';
  evoChainHTML += etapaEvolutiva2 + '</div>';
  evoChainHTML += etapaEvolutiva3 + '</div>';
  evoChainHTML += "</div>"; // Cierra el contenedor principal

  // Esperar a que el DOM esté completamente cargado para dibujar las líneas
  setTimeout(() => {
      lines.forEach(line => {
          const startElement = document.getElementById(line.start);
          const endElement = document.getElementById(line.end);
          if (startElement && endElement) {
              new LeaderLine(
                  startElement,
                  endElement,
                  {
                    endLabel: LeaderLine.captionLabel(`${line.method} ${line.condition}`, {
                        color: 'white',
                        outlineColor: 'black',
                        fontFamily: 'Arial',
                        //offset: [-20, 0]
                    }),
                    color: '#ccc',
                    endPlug: 'arrow3',
                    endSocket: 'left',
                    startSocket: 'auto',
                    path: 'grid',
                  }
              );
          }
      });
  }, 1000); // Ajusta el tiempo de espera si es necesario

  return evoChainHTML; // Devuelve el HTML como cadena
}


function generateUbicacionHTML(pokemon_name, encountersData) {
  // Crear el contenedor principal como cadena HTML
  let encountersHTML = `<div class="encounters"><h2>Ubicación</h2>`;

  // Definir rutas de íconos
  const typeIcons = {
    Land: './images/land3.png',
    LandClassic: './images/land3.png',
    Water: './images/water.png',
    WaterClassic: './images/water.png',
    OldRod: './images/rod2.png',
    OldRodClassic: './images/rod2.png',
    SuperRod: './images/rod2.png',
  };
  const typeDefinition = {
    Land: 'Hierba',
    LandClassic: 'Hierba Modo Classic',
    Water: 'Agua',
    WaterClassic: 'Agua Modo Classic',
    OldRod: 'Old Rod',
    OldRodClassic: 'Old Rod Modo Classic',
    SuperRod: 'Super Rod',
  };


  //LandClassic: Pokémon salvajes en la hierba de esa ruta en Modo Clásico (sin randomizar)
  //Land: Pokémon salvajes en la hierba alta de esa ruta en el resto de modos (sin randomizar)
  //OldRod y OldRodClassic: Lo mismo, pero para los Pokémon salvajes que se obtienen pescando

  
  let no_se_puede_capturar_pokemon = 0;

  // Iterar sobre todas las zonas en encountersData
  encountersData.forEach(zone => {
    const { nro_zona, nombre_zona, encounters } = zone;

    // Filtrar métodos donde el Pokémon esté presente
    const methods = Object.entries(encounters).filter(([method, pokemonList]) =>
      pokemonList.some(p => p.pokemon.toLowerCase() === pokemon_name.toLowerCase())
    );

    // Si el Pokémon está en esta zona, agregar la información
    if (methods.length > 0) {
      encountersHTML += `<details>
        <summary><strong>${nombre_zona}</strong></summary>
        <ul>`;
      
      methods.forEach(([method, pokemonList]) => {
        const pokemonDetails = pokemonList.find(p => p.pokemon.toLowerCase() === pokemon_name.toLowerCase());
        if (pokemonDetails) {
          const icon = typeIcons[method] || '';
          const definition = typeDefinition[method] || '';
          encountersHTML += `
            <li style="list-style-type: none;">
              <img src="${icon}" alt="${method}" class="icon">
              <strong>${definition}</strong>: Niveles ${pokemonDetails.min_level} - ${pokemonDetails.max_level}
            </li>
          `;
        }
      });

      no_se_puede_capturar_pokemon++;
      encountersHTML += `</ul></details>`;
    }
  });

  // Mostrar mensaje si el Pokémon no se encuentra en ninguna zona
  if (no_se_puede_capturar_pokemon === 0) {
    encountersHTML += `<p>No es posible capturarlo por encuentros</p>`;
  } 

  encountersHTML += `</div>`;
  return encountersHTML; // Devuelve el HTML como cadena
}

function generateMovesHTML(pokemonDetails, movesData) {
  // Crear el contenedor principal de la lista con un encabezado
  let listMovesHTML = `
    <div class="listMoves">
      <h2>Lista de Movimientos</h2>
      <div id="moves-container">
        <table id="general-moves-table" class="moves-table">
          <thead>
            <tr>
              <th data-sort="level">Nivel</th>
              <th data-sort="type">Tipo</th>
              <th data-sort="name">Nombre</th>
              <th data-sort="category">Categoría</th>
              <th data-sort="power">Poder</th>
              <th data-sort="accuracy">Precisión</th>
            </tr>
          </thead>
          <tbody id="moves-tbody">
  `;

  // Verificar si hay movimientos en el Pokémon
  if (pokemonDetails && pokemonDetails.moves) {
    // Ordenar los movimientos por nivel
    const sortedMoves = pokemonDetails.moves.sort((a, b) => a.level - b.level);

    // Generar filas para cada movimiento
    sortedMoves.forEach(({ level, move }) => {
      if (move) {
        const moveDetails = movesData.find(
          m => m.name_en && m.name_en.toLowerCase() === move.toLowerCase()
        );

        if (moveDetails) {
          listMovesHTML += `
            <tr>
              <td>${level}</td>
              <td><img src="/images/pokemon/moves/${moveDetails.type.toLowerCase()}.png" alt="${moveDetails.type} Type" class="type-icon"></td>
              <td>
                    <p class="move-tooltip" data-description="${moveDetails.description}">
                    ${moveDetails.name_es}
                     </p>
              </td>
              <td><img src="/images/pokemon/moves/${moveDetails.category.toLowerCase()}.png" alt="${moveDetails.category} Move" class="category-icon"></td>
              <td>${moveDetails.power || 'N/A'}</td>
              <td>${moveDetails.accuracy || 'N/A'}</td>
            </tr>
          `;
        } else {
          listMovesHTML += `
            <tr>
              <td colspan="6">Detalles no disponibles para el movimiento ${move}</td>
            </tr>
          `;
        }
      }
    });
  } else {
    listMovesHTML += `<tr><td colspan="6">No hay movimientos disponibles para este Pokémon.</td></tr>`;
  }

  // Cerrar la tabla y contenedor
  listMovesHTML += `
          </tbody>
        </table>
      </div>
    </div>
  `;

  return listMovesHTML;
}

function generateEggsMovesHTML(pokemonDetails, movesData) {
  // Crear el contenedor principal de la lista con un encabezado
  let listMovesHTML = `
    <div class="listMoves">
      <h2>Movimientos Huevo</h2>
      <div id="moves-container">
        <table id="egg-moves-table" class="moves-table">
          <thead>
            <tr>
              <th data-sort="eggType">Tipo</th>
              <th data-sort="eggName">Nombre</th>
              <th data-sort="eggCategory">Categoría</th>
              <th data-sort="eggPower">Poder</th>
              <th data-sort="eggAccuracy">Precisión</th>
            </tr>
          </thead>
          <tbody id="egg-moves-tbody">
  `;

  // Verificar si hay movimientos en el Pokémon
  if (pokemonDetails && pokemonDetails.egg_moves) {
    // Ordenar los movimientos por nombre
    const eggMoves = pokemonDetails.egg_moves.sort((a, b) => a.localeCompare(b));

    // Generar filas para cada movimiento
    eggMoves.forEach((move) => {
      if (move) {
        const moveDetails = movesData.find(
          m => m.name_en && m.name_en.toLowerCase() === move.toLowerCase()
        );

        if (moveDetails) {
          listMovesHTML += `
            <tr>
              <td><img src="/images/pokemon/moves/${moveDetails.type.toLowerCase()}.png" alt="${moveDetails.type} Type" class="type-icon"></td>
              <td>
                <p class="move-tooltip" data-description="${moveDetails.description}">
                  ${moveDetails.name_es}
                </p>
              </td>
              <td><img src="/images/pokemon/moves/${moveDetails.category.toLowerCase()}.png" alt="${moveDetails.category} Move" class="category-icon"></td>
              <td>${moveDetails.power || 'N/A'}</td>
              <td>${moveDetails.accuracy || 'N/A'}</td>
            </tr>
          `;
        } else {
          listMovesHTML += `
            <tr>
              <td colspan="5">Detalles no disponibles para el movimiento ${move}</td>
            </tr>
          `;
        }
      }
    });
  } else {
    listMovesHTML += `<tr><td colspan="5">No hay movimientos disponibles para este Pokémon.</td></tr>`;
  }

  // Cerrar la tabla y contenedor
  listMovesHTML += `
          </tbody>
        </table>
      </div>
    </div>
  `;

  return listMovesHTML;
}

function generateTMsMovesHTML(pokemonDetails, movesData) {
  // Crear el contenedor principal de la lista con un encabezado
  let listMovesHTML = `
    <div class="listMoves">
      <h2>Movimientos MT</h2>
      <div id="moves-container">
        <table id= "TM-moves-table" class="moves-table">
          <thead>
            <tr>
              <th data-sort="TMType">Tipo</th>
              <th data-sort="TMName">Nombre</th>
              <th data-sort="TMCategory">Categoría</th>
              <th data-sort="TMPower">Poder</th>
              <th data-sort="TMAccuracy">Precisión</th>
            </tr>
          </thead>
          <tbody id="TM-moves-tbody">
  `;

  // Verificar si hay movimientos en el Pokémon
  if (pokemonDetails && pokemonDetails.TM_moves) {
    // Ordenar los movimientos por nombre
    const TMMoves = pokemonDetails.TM_moves.sort((a, b) => a.localeCompare(b));

    // Generar filas para cada movimiento
    TMMoves.forEach((move) => {
      if (move) {
        const moveDetails = movesData.find(
          m => m.name_en && m.name_en.toLowerCase() === move.toLowerCase()
        );

        if (moveDetails) {
          listMovesHTML += `
            <tr>
              <td><img src="/images/pokemon/moves/${moveDetails.type.toLowerCase()}.png" alt="${moveDetails.type} Type" class="type-icon"></td>
              <td>
                <p class="move-tooltip" data-description="${moveDetails.description}">
                  ${moveDetails.name_es}
                </p>
              </td>
              <td><img src="/images/pokemon/moves/${moveDetails.category.toLowerCase()}.png" alt="${moveDetails.category} Move" class="category-icon"></td>
              <td>${moveDetails.power || 'N/A'}</td>
              <td>${moveDetails.accuracy || 'N/A'}</td>
            </tr>
          `;
        } else {
          listMovesHTML += `
            <tr>
              <td colspan="5">Detalles no disponibles para el movimiento ${move}</td>
            </tr>
          `;
        }
      }
    });
  } else {
    listMovesHTML += `<tr><td colspan="5">No hay movimientos disponibles para este Pokémon.</td></tr>`;
  }

  // Cerrar la tabla y contenedor
  listMovesHTML += `
          </tbody>
        </table>
      </div>
    </div>
  `;

  return listMovesHTML;
}

// Función para ordenar la tabla
// Función para ordenar la tabla
function sortTable(tbodyId, column, order) {
  const tbody = document.getElementById(tbodyId);
  const rows = Array.from(tbody.querySelectorAll('tr'));

  const getCellValue = (row, column) => {
    const cell = row.children[column];
    if (cell) {
      if (column === 1 || column === 3) {
        return cell.querySelector('img').alt;
      } else if (column === 4 || column === 5) {
        return cell.textContent === 'N/A' ? 0 : parseInt(cell.textContent, 10);
      } else if (column === 0) { // Nivel column
        return parseInt(cell.textContent, 10);
      } else {
        return cell.textContent;
      }
    }
    return '';
  };

  const sortedRows = rows.sort((a, b) => {
    const aValue = getCellValue(a, column);
    const bValue = getCellValue(b, column);

    if (aValue < bValue) {
      return order === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return order === 'asc' ? 1 : -1;
    }
    return 0;
  });

  tbody.innerHTML = '';
  sortedRows.forEach(row => tbody.appendChild(row));
}

function sortTable2(tbodyId, column, order) { //For eggs and TM table
  const tbody = document.getElementById(tbodyId);
  const rows = Array.from(tbody.querySelectorAll('tr'));

  const getCellValue = (row, column) => {
    const cell = row.children[column];
    if (cell) {
      if (column === 0 || column === 2) {
        return cell.querySelector('img').alt;
      } else if (column === 3 || column === 4) {
        return cell.textContent === 'N/A' ? 0 : parseInt(cell.textContent, 10);
      } else {
        return cell.textContent;
      }
    }
    return '';
  };

  const sortedRows = rows.sort((a, b) => {
    const aValue = getCellValue(a, column);
    const bValue = getCellValue(b, column);

    if (aValue < bValue) {
      return order === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return order === 'asc' ? 1 : -1;
    }
    return 0;
  });

  tbody.innerHTML = '';
  sortedRows.forEach(row => tbody.appendChild(row));
}


// Agregar manejadores de eventos para ordenar las columnas
document.addEventListener('click', (event) => {
  // Verifica si el clic fue en un <th> dentro de alguna tabla específica
  if (event.target.tagName === 'TH' && event.target.dataset.sort) {
    const table = event.target.closest('table');
    const validTables = ['egg-moves-table', 'TM-moves-table', 'general-moves-table'];

    // Revisa si la tabla tiene un ID válido
    if (table && validTables.includes(table.id)) {
      const column = Array.from(event.target.parentNode.children).indexOf(event.target);
      const order = event.target.dataset.order === 'asc' ? 'desc' : 'asc';
      event.target.dataset.order = order;
      const tbodyId = table.querySelector('tbody').id;

      //console.log(tbodyId);
      //console.log(table.id + " " + validTables);
      // Llama a la función de ordenamiento con el tbody correspondiente
      if (table.id === "general-moves-table"){
        sortTable(tbodyId, column, order);
      }else{
        sortTable2(tbodyId, column, order);
      }
      
      
    }
  }
});








/* Modificar init para inicializar con todos los entrenadores
function init() {
  loadPokemonDetails();
  loadAbilities();
  loadEncounters();
  loadMoves();
}

// Inicializa la página cuando carga
document.addEventListener("DOMContentLoaded", init);
*/

document.addEventListener("DOMContentLoaded", async () => {
  await loadAbilities();
  await loadEncounters();
  await loadMoves();
  await loadTypes();
   await loadMegas(); // NUEVO: cargamos megas antes de renderizar el pokemon
  loadPokemonDetails(); // Función que llama a displayPokemonDetails
});