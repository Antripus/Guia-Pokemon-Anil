
// Ruta de los archivos JSON
const jsonPathPokemon = "./data/Anil/pokemon.json";
const jsonPathMoves = "./data/Anil/moves.json";
const jsonPathAbilities = "./data/Anil/abilities.json";
const jsonPathEncounters = "./data/Anil/encounters.json";
const jsonPathTypes = "./data/Anil/types.json";
const jsonPathMegas = "./data/Anil/megas.json";

// Elementos del DOM
const pkmGrid = document.getElementById("pkmGrid");

//seteo inicial
const params = new URLSearchParams(window.location.search);
const pokemonNumber = params.get('number') ? parseInt(params.get('number'), 10) : null;
const pokemonName = params.get('name') ? params.get('name').toLowerCase().replace('.html', '') : null;




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

    displayPokemonDetails(pokemon, prePokemon, postPokemon);
  } catch (error) {
    console.error("Error al cargar detalles del Pokémon:", error);
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

  async function loadMegas() {
    try {
      const response = await fetch(jsonPathMegas);
      const megasData = await response.json();
      sessionStorage.setItem("megasData", JSON.stringify(megasData));
    } catch (error) {
      console.error("Error al cargar los datos de megaevoluciones:", error);
    }
  }


  function checkNumberBounds(number, maxNumber) {
    if (number < 1) return 1;
    if (number > maxNumber) return maxNumber;
    return number;
  }

function chequearLeftAndRight(pokemonNumber) {
  if (pokemonNumber < 1) {
    return 1;
  } else if (pokemonNumber > 1004) {
    return 1004;
  }
  return pokemonNumber;
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

  console.log("Tipo de pokemon= "+ pokemon.type + " debilidades: "+ debilidadesHTML)    
  return { debilidadesHTML, inmunidadesHTML, resistenciasHTML };
}


function generateCuadroEstadisticas (base_stats){

  // Obtener el valor máximo de los stats (excluyendo 'total' para no tener barra)
  const statsWithoutTotal = Object.entries(base_stats).filter(
    ([stat]) => stat !== "total"
  );
  const maxStatValue = 180 //Math.max(...statsWithoutTotal.map(([stat, value]) => value));


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
  const totalHTML = base_stats.total
    ? `<div class="grid">
        <p class="label">TOTAL</p>
        <p class="label">${base_stats.total}</p>
        </div>`
    : "";

    return statsHTML + totalHTML;
}

function displayPokemonDetails(pokemon, prePokemon, postPokemon) {
  
  const megasData = JSON.parse(sessionStorage.getItem("megasData"));
  const megaEvolution = megasData ? megasData.find(mega => mega.base_number === pokemon.number) : null;

  // Tipo y stats del Pokémon
  const typeHTML = pokemon.type.map(type =>
    `<p class="type" style="background-color: ${typeColors[type] || "#000"};">${type}</p>`
  ).join("");



  // Obtener el valor máximo de los stats (excluyendo 'total' para no tener barra)
  const HTMLcuadroEstadisticas = generateCuadroEstadisticas(pokemon.base_stats);
  let HTMLcuadroEstadisticasMega = "";
  let typeHTMLMega = "";
  

    //agarro los json de memoria
    const abilitiesData = JSON.parse(sessionStorage.getItem("abilitiesData"));
    const pokemonData = JSON.parse(sessionStorage.getItem("pokemonData"));
    const encountersData = JSON.parse(sessionStorage.getItem("encountersData"));
    const movesData = JSON.parse(sessionStorage.getItem("movesData"));
    const typesData = JSON.parse(sessionStorage.getItem("typesData"));
      if (!typesData) {
          console.error("typesData no está disponible. Verifica la carga del archivo.");
          return { debilidadesHTML: "<p>Error cargando datos</p>", inmunidadesHTML: "<p>Error cargando datos</p>", resistenciasHTML: "<p>Error cargando datos</p>" };
      }
  
    //Obtener ubicaciones
    const movesHTML = generateMovesHTML(pokemon, movesData);

    const eggsMovesHTML = generateEggsMovesHTML(pokemon, movesData);

    const TMsMovesHTML = generateTMsMovesHTML(pokemon, movesData);

    //Obtener ubicaciones
    const ubicacionesHTML = generateUbicacionHTML(pokemon.name, encountersData);

    // Obtener habilidades
    const abilitiesHTML = getAbilitiesHTML(pokemon,abilitiesData);
    let abilitiesHTMLMega = "";

    //Obtener cadena de Evoluciones
    const evolutionChain = getEvolutionChain(pokemon.name, pokemonData);
    const EvolucionesHTML = generateEvolutionHTML(evolutionChain, pokemonData);

    //Obterneer las relaciones de tipos  
    const { debilidadesHTML, inmunidadesHTML, resistenciasHTML } = generateTypeInteractionsHTML(pokemon, typesData);
    const megaInteraction = megaEvolution ? generateTypeInteractionsHTML(megaEvolution, typesData) : { debilidadesHTML: "", inmunidadesHTML: "", resistenciasHTML: "" };

    const debilidadesHTMLMega = megaInteraction.debilidadesHTML;
    const inmunidadesHTMLMega = megaInteraction.inmunidadesHTML;
    const resistenciasHTMLMega = megaInteraction.resistenciasHTML;

  console.log("aaaaaaaaaaaaaaaa "+debilidadesHTMLMega);

    // Generar pestañas para la mega evolución si existe

    let tabsHTML = `
      <div id="tabs">
        <button id="buttonBase" class="tab-button active" onclick="switchTab('base')">Pokémon Base</button>
    `;
    if (megaEvolution) {
      tabsHTML += `<button id="buttonMega" class="tab-button" onclick="switchTab('mega')">${megaEvolution.name}</button>`;
    }
    tabsHTML += `</div>`;


    //Armar el cuadro para la Mega
    if (megaEvolution){
      // Obtener el valor máximo de los stats (excluyendo 'total' para no tener barra)
      HTMLcuadroEstadisticasMega = generateCuadroEstadisticas(megaEvolution.base_stats);
      abilitiesHTMLMega =getAbilitiesHTML(megaEvolution,abilitiesData);

      typeHTMLMega = megaEvolution.type.map(type =>
        `<p class="type" style="background-color: ${typeColors[type] || "#000"};">${type}</p>`
      ).join("");

      
  }



  pkmGrid.innerHTML = `
    
        <div id="topPanel">
        <a id="goLeft" href=Anil-pokemon-details.html?number=${prePokemon.number}> 
          <div class="flex">
            <p>#${prePokemon.number}:</p>
            <img src="/images/pokemon/${prePokemon.name}.png" class="iconImg">
            <p>${prePokemon.name}</p>
          </div>
        </a>
      
          <h1 id="pkmName">${pokemon.name}</h1>

        <a id="goRight" href=Anil-pokemon-details.html?number=${postPokemon.number}> 
          <div class="flex">
            <p>#${postPokemon.number}:</p>
            <img src="/images/pokemon/${postPokemon.name}.png" class="iconImg">
            <p>${postPokemon.name}</p>
          </div> </a>
        </div>

            <div class="pkmImagen">
              
                  <div id="imgBase">
                  <img id="pkmImg" src="./images/pokemon/${pokemon.name}.png" alt="${pokemon.name}">
                  </div>
                  <div id="imgMega" class="hidden" >
                  ${megaEvolution ? `<img id="pkmImg" src="./images/pokemon/${megaEvolution.name.toLowerCase()}.png" alt="${megaEvolution.name}">` : ""}
                  </div>
            
            

              

              <div class="type-interactions">
                  <div class="interaction-category">
                      <h3>Debilidades</h3>
                      <div class="types">

                          <div id="debBase">
                          ${debilidadesHTML}
                          </div>
                          <div id="debMega" class="hidden" >
                          ${megaEvolution ? debilidadesHTMLMega :""}
                          </div>

                      </div>
                  </div>
                  <div class="interaction-category">
                      <h3>Inmunidad</h3>
                      <div class="types">

                          <div id="inmBase">
                          ${inmunidadesHTML}
                          </div>
                          <div id="inmMega" class="hidden" >
                          ${megaEvolution ? inmunidadesHTMLMega :""}
                          </div>
                      
                      </div>
                  </div>
                  <div class="interaction-category">
                      <h3>Resistencias</h3>
                      <div class="types">
                      
                          <div id="resBase">
                          ${resistenciasHTML}
                          </div>
                          <div id="resMega" class="hidden" >
                          ${megaEvolution ? resistenciasHTMLMega :""}
                          </div>

                     </div>
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
            
                  <div id="typeBase">
                  ${typeHTML}
                  </div>
                  <div id="typeMega" class="hidden" >
                  ${megaEvolution ? typeHTMLMega :""}
                  </div>

            
            </div>
           

            </div>
            ${megaEvolution ? tabsHTML :""}
            
            
        </div>

        <div class="secondBlock">
            <div class="flex">
                <p class="label">Base XP: ${pokemon.base_exp}</p>
 
            </div>

            <div class="flex last">
                <div class="flex last">
                <p class="label">Abilities</p>
                <ol>
                <div class="abilities">
                
                  <div id="abBase">
                  ${abilitiesHTML}
                  </div>
                  <div id="abMega" class="hidden" >
                  ${megaEvolution ? abilitiesHTMLMega :""}
                  </div>
                
                </div>

                <ol>
            </div>
            </div>
        </div>

        <div class="thirdBlock">

          <div class="statBlock">  
            <div id="statBase">
            ${HTMLcuadroEstadisticas}
            </div>
            <div id="statMega" class="hidden" >
             ${megaEvolution ? HTMLcuadroEstadisticasMega :""}
            </div>
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
     <div id="TMsMoves">
      ${TMsMovesHTML}  
    </div>
    <div id="eggMoves">
      ${eggsMovesHTML}  
    </div>
    `;

}

function switchTab(tabType) {
  const baseImg = document.getElementById("imgBase");
  const megaImg = document.getElementById("imgMega");
 
  const baseAb = document.getElementById("abBase");
  const megaAb = document.getElementById("abMega");
  
  const baseStats = document.getElementById("statBase");
  const megaStats = document.getElementById("statMega");

  const baseType = document.getElementById("typeBase");
  const megaType = document.getElementById("typeMega");
  
  const baseDeb = document.getElementById("debBase");
  const megaDeb = document.getElementById("debMega");

  const baseInm = document.getElementById("inmBase");
  const megaInm = document.getElementById("inmMega");

  const baseRes = document.getElementById("resBase");
  const megaRes = document.getElementById("resMega");
  

  const botonBase = document.getElementById("buttonBase");
  const botonMega = document.getElementById("buttonMega");

  if (tabType === "base") {
    baseImg.classList.remove("hidden");
    megaImg.classList.add("hidden");

    baseAb.classList.remove("hidden");
    megaAb.classList.add("hidden");

    baseStats.classList.remove("hidden");
    megaStats.classList.add("hidden");

    baseType.classList.remove("hidden");
    megaType.classList.add("hidden");

    baseDeb.classList.remove("hidden");
    megaDeb.classList.add("hidden");

    baseInm.classList.remove("hidden");
    megaInm.classList.add("hidden");

    baseRes.classList.remove("hidden");
    megaRes.classList.add("hidden");


    botonMega.classList.remove("active");
    botonBase.classList.add("active");

  } else if (tabType === "mega") {
    megaImg.classList.remove("hidden");
    baseImg.classList.add("hidden");

    megaAb.classList.remove("hidden");
    baseAb.classList.add("hidden");
    
    megaStats.classList.remove("hidden");
    baseStats.classList.add("hidden");

    megaType.classList.remove("hidden");
    baseType.classList.add("hidden");

    megaDeb.classList.remove("hidden");
    baseDeb.classList.add("hidden");

    megaInm.classList.remove("hidden");
    baseInm.classList.add("hidden");

    megaRes.classList.remove("hidden");
    baseRes.classList.add("hidden");



    botonBase.classList.remove("active");
    botonMega.classList.add("active");
  }
  
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


// Obtener HTML de habilidades
function getAbilitiesHTML(pokemonDetails, abilitiesData) {
  const allAbilities = [...pokemonDetails.abilities];
  if (pokemonDetails.hidden_ability) {
    allAbilities.push(pokemonDetails.hidden_ability);
  }
  
  return allAbilities
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
                          <a href="/Anil-pokemon-details.html?number=${stagePokemon.number}" class="pkm ${index === 0 ? "second" : index === 2 ? "first" : ""}" id="${className}-${stagePokemon.name}">
                              <img src="/images/pokemon/${stagePokemon.name}.png" alt="${stagePokemon.name}">
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
    Water: './images/water3.png',
    WaterClassic: './images/water3.png',
    OldRod: './images/rod2.png',
    OldRodClassic: './images/rod2.png',
  };
  const typeDefinition = {
    Land: 'Hierba - Modo Completo y Radical',
    LandClassic: 'Hierba - Modo Classic',
    Water: 'Agua - Modo Completo y Radical',
    WaterClassic: 'Agua - Modo Classic',
    OldRod: 'Old Rod - Modo Completo y Radical',
    OldRodClassic: 'Old Rod - Modo Classic',
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
          <tbody id="general-moves-tbody">
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









/*
// Modificar init para inicializar con todos los entrenadores
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
  await loadMegas();
  loadPokemonDetails(); // Función que llama a displayPokemonDetails
});