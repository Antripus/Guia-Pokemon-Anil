
// Ruta de los archivos JSON
const jsonPathPokemon = "./data/Opalo/pokemon.json";
const jsonPathMoves = "./data/Opalo/moves.json";
const jsonPathAbilities = "./data/Opalo/abilities.json";
const jsonPathEncounters = "./data/Opalo/encounters.json";

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
  const encountersData = JSON.parse(sessionStorage.getItem("encountersData"));
  const movesData = JSON.parse(sessionStorage.getItem("movesData"));

  
    //Obtener ubicaciones
    const movesHTML = generateMovesHTML(pokemon, movesData);

    //Obtener ubicaciones
    const ubicacionesHTML = generateUbicacionHTML(pokemon.name, encountersData);

    // Obtener habilidades
    const abilitiesHTML = getAbilitiesHTML(pokemon,abilitiesData);


    //Obtener cadena de Evoluciones
    const evolutionChain = getEvolutionChain(pokemon.name, pokemonData);
    const EvolucionesHTML = generateEvolutionHTML(evolutionChain, pokemonData);

  

  pkmGrid.innerHTML = `
    
        <div id="topPanel">
        <a id="goLeft" href=Opalo-pokemon-details.html?number=${prePokemon.number}> 
          <div class="flex">
            <p>#${prePokemon.number}:</p>
            <img src="/images/Opalo/pokemon/${prePokemon.number000}.png" class="iconImg">
            <p>${prePokemon.name}</p>
          </div>
        </a>
      
          <h1 id="pkmName">${pokemon.name}</h1>

        <a id="goRight" href=Opalo-pokemon-details.html?number=${postPokemon.number}> 
          <div class="flex">
            <p>#${postPokemon.number}:</p>
            <img src="/images/Opalo/pokemon/${postPokemon.number000}.png" class="iconImg">
            <p>${postPokemon.name}</p>
          </div> </a>
        </div>

          <div class="pkmImagen">  
            <img id="pkmImg" src="./images/Opalo/pokemon/${pokemon.number000}.png" alt="${pokemon.name}">
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
    </div> 

    <div id="ubicacion">
      ${ubicacionesHTML}        
    </div> 
    <div id="moves">
      ${movesHTML}  
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
                          <a href="/Opalo-pokemon-details.html?number=${stagePokemon.number}" class="pkm ${index === 0 ? "second" : index === 2 ? "first" : ""}" id="${className}-${stagePokemon.name}">
                              <img src="/images/Opalo/pokemon/${stagePokemon.number000}.png" alt="${stagePokemon.name}">
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
    Land: 'Hierva',
    LandClassic: 'Hierva Modo Classic',
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
        <table class="moves-table">
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

// Función para ordenar la tabla
function sortTable(column, order) {
  const tbody = document.getElementById('moves-tbody');
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

// Agregar manejadores de eventos para ordenar las columnas
document.addEventListener('click', (event) => {
  if (event.target.tagName === 'TH' && event.target.dataset.sort) {
    const column = Array.from(event.target.parentNode.children).indexOf(event.target);
    const order = event.target.dataset.order === 'asc' ? 'desc' : 'asc';
    event.target.dataset.order = order;
    sortTable(column, order);
  }
});









// Modificar init para inicializar con todos los entrenadores
function init() {
  loadPokemonDetails();
  loadAbilities();
  loadEncounters();
  loadMoves();
}

// Inicializa la página cuando carga
document.addEventListener("DOMContentLoaded", init);