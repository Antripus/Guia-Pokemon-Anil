
// Ruta de los archivos JSON
const jsonPathPokemon = "./data/pokemon.json";
const jsonPathMoves = "./data/moves.json";
const jsonPathAbilities = "./data/abilities.json";

// Elementos del DOM
const pkmGrid = document.getElementById("pkmGrid");

//seteo inicial
const params = new URLSearchParams(window.location.search);
const pokemonNumber = parseInt(params.get('number'), 10); // Convertir a entero



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
    const pokemon = pokemonData.find(p => p.number === pokemonNumber);
    sessionStorage.setItem("pokemonData", JSON.stringify(pokemonData)); // guardo en la memoria
    //Busco los nros anteriores y posteriores al pokemon que estoy viendo
    let preNumber = pokemonNumber - 1;
    let postNumber = pokemonNumber + 1;
    console.log(pokemonNumber);
    console.log(preNumber);
    console.log(postNumber);

    //Verifico que este en mi rango de Numeros sino seteo al primero o al ultimo
    preNumber = chequearLeftAndRight(preNumber)
    postNumber = chequearLeftAndRight(postNumber)
    console.log(preNumber);
    console.log(postNumber);

    // busco en el JSON la info completa del pokemon anterior y posterior
    const prePokemon = pokemonData.find(p => p.number === preNumber);
    const postPokemon = pokemonData.find(p => p.number === postNumber);

    //si existe el pokemon que busco lo muestro
    if (pokemon) {
      displayPokemonDetails(pokemon, prePokemon, postPokemon);
    }
  } catch (error) {
    console.error("Error loading Pokémon details:", error);
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
        `<span class="type" style="background-color: ${typeColors[type] || "#000"
        }">${type} </span>`
    )
    .join(" ");

  // Obtener el valor máximo de los stats (excluyendo 'total' para no tener barra)
  const statsWithoutTotal = Object.entries(pokemon.base_stats).filter(
    ([stat]) => stat !== "total"
  );
  const maxStatValue = 200 //Math.max(...statsWithoutTotal.map(([stat, value]) => value));


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
        <p class="statVal">${pokemon.base_stats.total}</p>
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
      
          <h1 id="pkmName">${pokemon.name} (#${pokemon.number})</h1>

        <a id="goRight" href=pokemon-details.html?number=${postPokemon.number}> 
          <div class="flex">
            <p>#${postPokemon.number}:</p>
            <img src="/images/pokemon/${postPokemon.name}.png" class="iconImg">
            <p>${postPokemon.name}</p>
          </div> </a>
        </div>


          <img id="pkmImg" src="./images/pokemon/${pokemon.name}.png" alt="${pokemon.name}">

        <div id="tabs">
            <div class="tab ax active">
                <h3>AX</h3>
            </div>
        </div>

        <div class="tabContent ax active">
        <div class="firstBlock">
            <div class="flex">
                <p class="label">Species</p>
                <p> ${pokemon.number}</p>
            </div>
            <div class="flex">
                <p class="label">Type: ${typeHTML}</p>
            </div>
            
            <div class="flex last">
                <p class="label">Abilities</p>
                <ol>
                <div class="abilities">${abilitiesHTML}</div>
                <ol>
            </div>
        </div>

        <div class="secondBlock">
            <div class="flex">
                <p class="label">Base XP</p>
                <p>${pokemon.base_exp}</p>
            </div>
            <div class="flex last">
                <p class="label">Growth Rate</p>
                <p>${pokemon.growth_rate}</p>
            </div>
            <div class="flex">
                <p class="label">Description</p>
                <p>${pokemon.pokedex_description}</p>
            </div>
        </div>

        <div class="statBlock">${statsHTML}${totalHTML}</div>
            
        </div>
    </div>
    
    <div id="evoContent">
      ${EvolucionesHTML}
    </div>
  
    <hr>
        <hr>
        <hr>
        <p><strong>Abilities:</strong> ${pokemon.abilities}</p>
        <p><strong>Hidden Ability:</strong> ${pokemon.hidden_ability}</p>
        <p><strong>Type:</strong> ${typeHTML}</p>
        <p><strong>Base Stats:</strong></p>
        <div class="statBlock">${statsHTML}${totalHTML}</div>
        <p><strong>Pokedex Description:</strong> ${pokemon.pokedex_description}</p>
    </div>
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
function getEvolutionChain(pokemonName, pokemonData) {
  // Buscar el Pokémon inicial en la base de datos
  const pokemon = pokemonData.find(p => p.name.toLowerCase() === pokemonName.toLowerCase());
  if (!pokemon) return ["No se encontró el Pokémon"];

  // Inicializar la cadena evolutiva con 3 etapas
  let evolutionChain = Array(3).fill("");

  // Colocar el Pokémon actual en la etapa correspondiente
  evolutionChain[pokemon.evolution_stage - 1] = pokemon.name;

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
  const evolutions = pokemonData.filter(p =>
      p.pre_evolution && p.pre_evolution.toLowerCase() === pokemon.name.toLowerCase()
  );

  // Insertar todas las evoluciones en la etapa correspondiente
  if (evolutions.length > 0) {
      evolutionChain[evolutions[0].evolution_stage - 1] = evolutions.map(evo => evo.name).join(", ");
  }

  return evolutionChain;
}

//Generar codigo HTML para cuadro de evoluciones
function generateEvolutionHTML(evolutionChain, pokemonData) {
  // Crear el contenedor principal como cadena HTML
  let evoChainHTML = '<div class="evoChain">';

  // Iterar sobre las etapas evolutivas
  ["preMon", "currMon", "postMon"].forEach((className, index) => {
      const stageName = evolutionChain[index];

      if (stageName) {
          const stagePokemon = pokemonData.find(p => p.name === stageName);
          if (stagePokemon) {
              const typeHTML = stagePokemon.type.map(type => `
                  <p class="type" style="background-color: ${typeColors[type] || "#000"};">${type}</p>
              `).join("");

              evoChainHTML += `
                  <div class="${className}">
                      <a href="/dex/${stagePokemon.name}" class="pkm ${index === 0 ? "second" : index === 2 ? "first" : ""}">
                          <img src="/images/pokemon/${stagePokemon.name}.png" alt="${stagePokemon.name}">
                          <p>${stagePokemon.name}</p>
                          <div class="flex">${typeHTML}</div>
                      </a>
                  </div>
              `;
          }
      } else {
          evoChainHTML += `<div class="${className}"></div>`; // Div vacío si no hay Pokémon en la etapa
      }
  });

  evoChainHTML += "</div>"; // Cierra el contenedor principal

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