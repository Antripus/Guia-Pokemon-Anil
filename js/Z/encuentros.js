
// Ruta de los archivos JSON
const jsonPathPokemon = "./data/Z/pokemon.json";
const jsonPathTrainers = "./data/Z/trainers.json";
const jsonPathMoves = "./data/Z/moves.json";
const jsonPathAbilities = "./data/Z/abilities.json";

// Elementos del DOM
const listElement = document.getElementById("encounter-list");
const trainerSection = document.getElementById("trainer-details");
const pokemonSection = document.getElementById("pokemon-details");


// Función para cargar el pokemon.JSON
async function loadPokemon() {
    try {
      const response = await fetch(jsonPathPokemon);
      const pokemonData = await response.json();
      sessionStorage.setItem("pokemonData", JSON.stringify(pokemonData)); // Almacena los datos en sessionStorage
      //populateList(pokemonData); // Rellena la lista
    } catch (error) {
      console.error("Error loading Pokémon data:", error);
    }
  }

// Función para cargar el trainers.JSON
async function loadTrainers() {
    try {
      const response = await fetch(jsonPathTrainers);
      const trainerData = await response.json();
      sessionStorage.setItem("trainerData", JSON.stringify(trainerData)); // Almacena los datos en sessionStorage
      populateTrainersList(trainerData); // Rellena la lista
    } catch (error) {
      console.error("Error loading Trainer data:", error);
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


// Función para rellenar la lista de Trainers
function populateTrainersList(trainerData) {
  listElement.innerHTML = ""; // Limpiar la lista para evitar duplicados
  let trainerElements = [];

  // Ordenamos por: Orden (numérico) asc, luego name, luego variant (null al final)
  trainerData.sort((a, b) => {
    const ao = (a.Orden === undefined || a.Orden === null) ? Infinity : Number(a.Orden);
    const bo = (b.Orden === undefined || b.Orden === null) ? Infinity : Number(b.Orden);
    if (ao !== bo) return ao - bo;

    // si Orden igual, ordenamos por nombre
    const nameCmp = String(a.name || "").localeCompare(String(b.name || ""));
    if (nameCmp !== 0) return nameCmp;

    // finalmente por variant (null/undefined al final)
    const av = (a.variant === undefined || a.variant === null) ? Infinity : Number(a.variant);
    const bv = (b.variant === undefined || b.variant === null) ? Infinity : Number(b.variant);
    return av - bv;
  });

  trainerData.forEach((trainer, idx) => {
    const listItem = document.createElement("li");
    listItem.className = "trainer-list-item";

    // Mostrar Orden real (si es 0 o Infinity -> lo ocultamos como vacío)
    const displayOrden = (trainer.Orden && Number(trainer.Orden) > 0) ? Number(trainer.Orden) : "";

    // Nombre con variante si existe
    const variantLabel = (trainer.variant !== undefined && trainer.variant !== null) ? ` (v${trainer.variant})` : "";

    // sprite path robusto
    const spritePath = trainer.sprite ? `./images/Z/trainers/${trainer.sprite}.png` : "./images/Z/trainers/no_sprite.png";

    listItem.innerHTML = `
      <h3 class="numeroDeOrden">${displayOrden}</h3>
      <img src="${spritePath}" alt="${trainer.name}" class="trainer-thumb">
      <h3 class="nombreEntrenador">${trainer.name}${variantLabel}</h3>
      <img src="./images/pokeball4.png" alt="#Pokemons" class="pokeballIMG">
      <h3 class="numeroDePokemon">#${trainer.num_pokemon || (trainer.pokemons ? trainer.pokemons.length : 0)}</h3>
    `;


    // click -> mostrar detalles
    listItem.addEventListener("click", () => {
      showTrainerCard(trainer, listItem, trainerElements);
      // guardamos el par name+variant para poder reabrir después correctamente
      sessionStorage.setItem("selectedTrainer", JSON.stringify({ name: trainer.name, variant: trainer.variant }));
    });

    listElement.appendChild(listItem);
    trainerElements.push(listItem);
  });

  // Restaurar seleccionado guardado (buscamos la coincidencia por name+variant)
  const storedTrainerRaw = sessionStorage.getItem("selectedTrainer");
  if (storedTrainerRaw) {
    try {
      const stored = JSON.parse(storedTrainerRaw);
      const index = trainerData.findIndex(t =>
        t.name === stored.name &&
        // treat null/undefined variants as equal
        ((t.variant === stored.variant) || (t.variant == null && stored.variant == null))
      );
      if (index >= 0 && trainerElements[index]) {
        showTrainerCard(trainerData[index], trainerElements[index], trainerElements);
      }
    } catch (e) {
      console.warn("selectedTrainer malformed in sessionStorage", e);
    }
    sessionStorage.removeItem("selectedTrainer");
  } else {
    // si no hay guardado, seleccionar el primer trainer con Orden>0; si no existe, seleccionar el primero de la lista
    const firstImportantIndex = trainerData.findIndex(t => t.Orden && Number(t.Orden) > 0);
    const pickIndex = firstImportantIndex >= 0 ? firstImportantIndex : (trainerData.length ? 0 : -1);
    if (pickIndex >= 0) {
      showTrainerCard(trainerData[pickIndex], trainerElements[pickIndex], trainerElements);
    }
  }
}




// Colores para cada tipo de Pokémon
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
    Fairy: "#ee99ee",
    Fighting: "#C03028",
    Flying: "#A890F0",
    Ghost: "#705898",
    Steel: "#B8B8D0"
  };
// Colores para cada tipo de Pokémon
const natureTypes = {
    hasty: "Hasty (+Spe / -Def)",
    adamant: "Adamant (+Atk / -Sp. Atk)",
    bashful: "Neutra",//"Bashful (+Sp. Atk / -Sp. Atk)",
    bold: "Bold (+Def / -Atk)",
    brave: "Brave (+Atk / -Spe)",
    calm: "Calm (+Sp. Def / -Atk)",
    careful: "Careful (+Sp. Def / -Sp. Atk)",
    docile: "Neutra",//"Docile (+Def / -Def)",//
    gentle: "Gentle (+Sp. Def / -Def)",
    hardy: "Neutra",//"Hardy (+Atk / -Atk)",//
    hasty: "Hasty (+Spe / -Def)",
    impish: "Impish (+Def / -Sp. Atk)",
    jolly: "Jolly (+Spe / -Sp. Atk)",
    lax: "Lax (+Def / -Sp. Def)",
    lonely: "Lonely (+Atk / -Def)",
    mild: "Mild (+Sp. Atk / -Def)",
    modest: "Modest (+Sp. Atk / -Atk)",
    naive: "Naive (+Spe / -Sp. Def)",
    naughty: "Naughty (+Atk / -Sp. Def)",
    quiet: "Quiet (+Sp. Atk / -Spe)",
    quirky: "Neutra",//"Quirky (+Sp. Def / -Sp. Def)",//
    rash: "Rash (+Sp. Atk / -Sp. Def)",
    relaxed: "Relaxed (+Def / -Spe)",
    sassy: "Sassy (+Sp. Def / -Spe)",
    serious: "Neutra",//"Serious (+Spe / -Spe)",//
    timid: "Timid (+Spe / -Atk)",
  };

    // Función para buscar un Pokémon por nombre en pokemonData
    // Mejorada: busca por internal_name o por name (case-insensitive)
    function findPokemonByName(name, pokemonData) {
      if (!name || !pokemonData) return null;
      const lname = name.toLowerCase();
      return pokemonData.find(p => {
        const internal = (p.internal_name || "").toLowerCase();
        const pname = (p.name || "").toLowerCase();
        return internal === lname || pname === lname || p.number000 === name || String(p.number) === name;
      }) || null;
    }


  // Función para mostrar la tarjeta de entrenadores
  function showTrainerCard(trainer, selectedElement, trainerElements = []) {
    const movesData = JSON.parse(sessionStorage.getItem("movesData") || "[]");
    const abilitiesData = JSON.parse(sessionStorage.getItem("abilitiesData") || "[]");
    const pokemonData = JSON.parse(sessionStorage.getItem("pokemonData") || "[]");

    // Resaltar seleccionado
    if (trainerElements && trainerElements.length) {
      trainerElements.forEach(item => item.classList.remove("selected-trainer"));
      if (selectedElement) selectedElement.classList.add("selected-trainer");
    }

    // Sprite / nombre / meta
    const spritePath = trainer.sprite ? `./images/Z/trainers/${trainer.sprite}.png` : "./images/Z/trainers/no_sprite.png";
    const variantLabel = trainer.variant ? ` (v${trainer.variant})` : "";

    trainerSection.innerHTML = `
      <div class="trainer-card">
        <div class="trainer1">
          <img src="${spritePath}" alt="${trainer.name}" class="trainer-img">
          <h2>${trainer.name}${variantLabel}</h2>
          <div class="tipo">${trainer.tipo || ""}</div>
          <div class="Tipo-Combate">${trainer.tipo_de_combate || ""}</div>
        </div>

        <div class="trainer2">
          <div class="header">
           
            <h3 class="nombre-entrenador">${trainer.descripcion_de_entrenador || ""}</h3>
            <div class="cantPokemon">
              <img src="./images/pokeball4.png" alt="#Pokemons" class="pokeballIMG">
              <h3>#${trainer.num_pokemon || trainer.pokemons.length}</h3>
            </div>
          </div>
          <div class="objCurativo">
            <img src="./images/pocion.png" alt="Healing" class="pokeballIMG">
            <h3>${trainer.healing_item || "Ninguna"}</h3>
          </div>
          <h2 class="ubicacion">${trainer.ubicacion || ""}</h2>
        </div>

        <div class="trainer3">
          <div class="resumenPokemon">
            ${trainer.pokemons
              .concat(Array(6 - trainer.pokemons.length).fill({ name: "noPokemon" }))
              .slice(0, 6)
              .map(pkm => {
                const p = findPokemonByName(pkm.name, pokemonData);
                if (p) {
                  return `<a href="/Z-pokemon-details.html?name=${pkm.name}.html" target="_blank">
                            <img src="./images/Z/pokemon/${p.number000}.png" alt="${pkm.name}">
                          </a>`;
                } else {
                  return `<a href="/Z-pokemon-details.html?name=${pkm.name}.html">
                            <img src="./images/pokemon/noPokemon.png" alt="No Pokémon">
                          </a>`;
                }
              }).join("")}
          </div>
        </div>
      </div>
    `;

    // Detalle de cada Pokémon del trainer
    pokemonSection.innerHTML = "";
    (trainer.pokemons || []).forEach((pkm, index) => {
      const pokemonDetails = findPokemonByName(pkm.name, pokemonData);
      if (!pokemonDetails) {
        // fallback: card simple
        const fallbackCard = document.createElement("div");
        fallbackCard.className = `pokemon-card pkm${index+1}`;
        fallbackCard.innerHTML = `<h3>${pkm.name}</h3><p>Detalles no encontrados</p>`;
        pokemonSection.appendChild(fallbackCard);
        return;
      }

      const typeHTML = (pokemonDetails.type || []).map(type => `<span class="type" style="background-color: ${typeColors[type] || '#000'}">${type}</span>`).join(" ");
      const abilitiesHTML = getAbilitiesHTML(pokemonDetails, pkm.ability, abilitiesData);

      // Movimientos del trainer: pkm.moves puede ser array con cadenas (códigos). Buscamos info en movesData.
      const movesHTML = (pkm.moves || []).map(moveCode => {
        if (!moveCode) return '';
        const moveDetails = movesData.find(m => m.name_en && (m.name_en.toLowerCase() === moveCode.toLowerCase() || m.name_en === moveCode));
        if (moveDetails) {
          return `
            <div class="moveTypeWrapper">
              <img src="/images/pokemon/moves/${moveDetails.type.toLowerCase()}.png" alt="${moveDetails.type}">
              <p class="move-tooltip" data-description="${moveDetails.description}">${moveDetails.name_es}</p>
              <img src="/images/pokemon/moves/${moveDetails.category.toLowerCase()}.png" alt="${moveDetails.category}">
              <div class="PowerBox"><p>Power</p><p>${moveDetails.power || '—'}</p></div>
              <div class="AccBox"><p>Acc</p><p>${moveDetails.accuracy || '—'}</p></div>
            </div>`;
        } else {
          // Si no encontramos detalles
          return `<div class="moveTypeWrapper"><p>${moveCode}</p></div>`;
        }
      }).join("");

      const card = document.createElement("div");
      card.className = `pokemon-card pkm${index + 1}`;
      card.innerHTML = `
        <h3>${pkm.name}</h3>
        <img src="./images/Z/pokemon/${pokemonDetails.number000}.png" alt="${pkm.name}" class="pokemonIMG">
        <div>
          <div class="flex"><p>${typeHTML}</p></div>
          <h3>Level ${pkm.level || '—'}</h3>
          <hr>
          <div class="abilities">${abilitiesHTML}</div>
          <hr>
          <div class="itemImgWrapper">
            <p class="noItem">${pkm.item ? capitalizeFirstWord(pkm.item) : "Sin Objeto"}</p>
          </div>
          <div class="nature"><p>${natureTypes[(pkm.nature || '').toLowerCase()] || capitalizeFirstWord(pkm.nature || 'Unknown')}</p></div>
          ${movesHTML}
        </div>
      `;
      pokemonSection.appendChild(card);
    });
  }

    

    // Obtener HTML de habilidades
    function getAbilitiesHTML(pokemonDetails, abilityIndex, abilitiesData) {
      // Clonar las habilidades comunes del Pokémon
      let abilitiesToShow = [...pokemonDetails.abilities];

      if (pokemonDetails.hidden_ability) {
        abilitiesToShow.push(pokemonDetails.hidden_ability);
      }      
      console.log(abilitiesToShow);
      
      if(abilitiesToShow.length===1){
        //no hago nada porque solo tiene 1 habilidad
      }else{
        // Ajusto abilityToShow a la lógica según el índice
        if (abilityIndex === '0') {
          abilitiesToShow = abilitiesToShow.slice(0, 1); // Solo la primera habilidad
        } else if (abilityIndex === '1') {
          abilitiesToShow = abilitiesToShow.slice(1, 2); // Solo la segunda habilidad
        }
        else if (abilityIndex === '2') {
          abilitiesToShow = abilitiesToShow.slice(abilitiesToShow.length-1, abilitiesToShow.length); // con el 2 pone el pokemon tiene la habilidad oculta, que en este punto es la ultima de mi lista
        } else if (abilityIndex === 'X' && pokemonDetails.hidden_ability) {
          abilitiesToShow = abilitiesToShow.slice(0, abilitiesToShow.length-1); // remuevo la habilidad oculta de las opciones
        }
      }

      
      console.log(pokemonDetails.name+ " abilityIndex: " +abilityIndex);
      console.log(abilitiesToShow);

      // Generar el HTML para las habilidades seleccionadas
      return abilitiesToShow
        .map((abilityName) => {
          const ability = abilitiesData.find(
            (a) => a.name_en.toLowerCase() === abilityName.toLowerCase()
          );
          return ability
            ? `<p class="ability-tooltip" data-description="${ability.description}">
                  ${ability.name_es}
              </p>`
            : `<p>${abilityName}</p>`;
        })
        .join("");
    }

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


    function capitalizeFirstWord(str) {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

const searchBar = document.getElementById("search-bar");

if (searchBar) {
  searchBar.addEventListener("input", () => {
    const query = searchBar.value.trim().toLowerCase();
    const trainerData = JSON.parse(sessionStorage.getItem("trainerData") || "[]");
    const listItems = listElement.querySelectorAll("li");
    let firstVisibleTrainer = null;

    listItems.forEach((item, index) => {
      const trainerNameEl = item.querySelector(".nombreEntrenador");
      const trainerName = trainerNameEl ? trainerNameEl.textContent.toLowerCase() : item.textContent.toLowerCase();
      if (trainerName.includes(query)) {
        item.style.display = "flex";
        // index corresponde al orden actual de trainerData usado en populateTrainersList,
        // por eso reutilizamos trainerData[index] (la función populate ya reordenó trainerData).
        if (!firstVisibleTrainer) firstVisibleTrainer = trainerData[index];
      } else {
        item.style.display = "none";
      }
    });

    if (firstVisibleTrainer) {
      showTrainerCard(firstVisibleTrainer);
    }
  });
}


// Referencia a los botones de radio
const starterRadios = document.querySelectorAll('input[name="starter"]');


// Función para filtrar entrenadores según el Pokémon inicial
function filterTrainersByStarter(trainerData, starter) {
  const filteredData = trainerData.filter((trainer) => {
    
    if (trainer.Orden === 0){
      return false; //Excluyo todos los encuentros normales y dejo los importantes
    }
    
    if(trainer.pokemon_inicial === "Cambia"){ //Chespin 1 - Fennekin 2 - Froakie 3 --Yo siempre tengo ventaja en el starter
      if (trainer.name === "Crisanto" || trainer.name === "???") { //Chespin - Fennekin - Froakie
        if (starter === "Chespin" && (trainer.variant === 2 || trainer.variant === 3)) {
          return false; // Crisanto tiene Fennekin - Excluir variantes 2 y 3 y 5 6
        }
        if (starter === "Fennekin" && (trainer.variant === 1 || trainer.variant === 3)) {
          return false; // Crisanto tiene Froakie - Excluir variantes 2 y 3 y 5 6
        }
        if (starter === "Froakie" && (trainer.variant === 2 || trainer.variant === 1)) {
          return false; // Crisanto tiene Chespin - Excluir variantes 2 y 3 y 5 6
        }
      }
    }

    if(trainer.pokemon_inicial === "Cambia"){ //Chespin 1 - Fennekin 2 - Froakie 3 --Melia siempre tiene ventaja en el starter
      if (trainer.name === "Melia") { //Chespin - Fennekin - Froakie
        if (starter === "Chespin" && (trainer.variant === 2 || trainer.variant === 3)) {
          return false; // Melia tiene Fennekin - Excluir variantes 2 y 3 y 5 6
        }
        if (starter === "Fennekin" && (trainer.variant === 1 || trainer.variant === 3)) {
          return false; // Melia tiene Froakie - Excluir variantes 2 y 3 y 5 6
        }
        if (starter === "Froakie" && (trainer.variant === 1 || trainer.variant === 2)) {
          return false; // Melia tiene Chespin - Excluir variantes 2 y 3 y 5 6
        }
      }
    }


    return true; // Incluir el resto
  });

  return filteredData;
}


// Función para manejar cambios en los botones de radio
function handleStarterChange() {
  const selectedStarter = document.querySelector('input[name="starter"]:checked')?.value;
  
  if (selectedStarter) {
    const trainerData = JSON.parse(sessionStorage.getItem("trainerData"));
    
    //Filtramos por poquemon inicial
    const filteredData = filterTrainersByStarter(trainerData, selectedStarter);
    
    listElement.innerHTML = ""; // Limpiar la lista
    populateTrainersList(filteredData); // Rellenar la lista con datos filtrados
  }
}

// Asignar el evento a los botones de radio
starterRadios.forEach((radio) => {
  radio.addEventListener("change", handleStarterChange);
});


// Modificar init para inicializar con todos los entrenadores
async function init() {
  await loadPokemon();
  await loadTrainers();
  await loadMoves();
  await loadAbilities();

  // Seleccionar valores iniciales
  document.getElementById("chespin").checked = true;

  // Ejecutar el filtro inicial
  handleStarterChange();
}

// Inicializa la página cuando carga
document.addEventListener("DOMContentLoaded", init);


  
  /* Función principal para inicializar la página
  function init() {
    //displayTrainerInfo(trainerData);
    //displayPokemonDetails(trainerData.team);
    loadPokemon()
    loadTrainers()
  }*/


  
  // Inicializa la página cuando carga
  //document.addEventListener("DOMContentLoaded", init);


  