
// Ruta de los archivos JSON
const jsonPathPokemon = "./data/pokemon.json";
const jsonPathMoves = "./data/moves.json";
const jsonPathAbilities = "./data/abilities.json";

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

       // Obtener habilidades
       const abilitiesHTML = getAbilitiesHTML(pokemon,abilitiesData);


    //Obtener cadena de Evoluciones
    const evolutionChain = getEvolutionChain(pokemon.name, pokemonData);
    const EvolucionesHTML = generateEvolutionHTML(evolutionChain, pokemonData);


  pkmGrid.innerHTML = `
    
        <div id="topPanel">
        <a id="goLeft" href=pokemon-details.html?number=${prePokemon.number}> 
          <div class="flex">
            <p>#${prePokemon.number}:</p>
            <img src="/images/pokemon/${prePokemon.name}.png" class="iconImg">
            <p>${prePokemon.name}</p>
          </div>
        </a>
      
          <h1 id="pkmName">${pokemon.name}</h1>

        <a id="goRight" href=pokemon-details.html?number=${postPokemon.number}> 
          <div class="flex">
            <p>#${postPokemon.number}:</p>
            <img src="/images/pokemon/${postPokemon.name}.png" class="iconImg">
            <p>${postPokemon.name}</p>
          </div> </a>
        </div>

          <div class="pkmImagen">  
            <img id="pkmImg" src="./images/pokemon/${pokemon.name}.png" alt="${pokemon.name}">
          </div>
          <!-- tab para las megas
          <div class="statBlock">  
          ${statsHTML}${totalHTML}
          </div>
           -->
        <div id="tabs">
            <!-- tab para las megas
            <div class="tab ax active">
                <h3>AX</h3>
            </div>
              -->
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
                <p class="label">Base XP: ${pokemon.base_exp}</p>
 
            </div>

            <div class="flex last">
                <div class="flex last">
                <p class="label">Abilities</p>
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

    `;

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
                          <a href="/pokemon-details.html?number=${stagePokemon.number}" class="pkm ${index === 0 ? "second" : index === 2 ? "first" : ""}" id="${className}-${stagePokemon.name}">
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






// Modificar init para inicializar con todos los entrenadores
function init() {
  loadPokemonDetails();
  loadAbilities();

  // Seleccionar tab inicial


  // Ejecutar el filtro inicial
 
}

// Inicializa la página cuando carga
document.addEventListener("DOMContentLoaded", init);