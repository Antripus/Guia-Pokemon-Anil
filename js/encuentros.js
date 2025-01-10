
// Ruta de los archivos JSON
const jsonPathPokemon = "./data/pokemon.json";
const jsonPathTrainers = "./data/trainers_actualizados.json";
const jsonPathMoves = "./data/moves.json";
const jsonPathAbilities = "./data/abilities.json";

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
  let trainerElements = []; // Array para guardar referencias a los elementos <li>

  // Ordenar los entrenadores por el campo "Orden"
  trainerData.sort((a, b) => a.Orden - b.Orden);

  // Recorre todos los datos de los Trainers
  trainerData.forEach((trainer) => {
      // Crea un elemento <li> para cada Trainer
      const listItem = document.createElement("li");

      // Inserta la imagen y el texto (número y nombre del Pokémon) dentro del <li>
      listItem.innerHTML = `
          <h3 class="numeroDeOrden"> ${trainer.Orden} </h3>
          <img src="./images/trainers/${trainer.name}.png" alt="${trainer.name}">
          <h3 class="nombreEntrenador"> ${trainer.name} </h3> 
          <img src="./images/pokeball4.png" alt="#Pokemons" class="pokeballIMG"> 
          <h3 class="numeroDePokemon"> #${trainer.num_pokemon} </h3>
      `;

      // Agrega un evento "click" al elemento <li> que muestra los detalles del Pokémon seleccionado
      listItem.addEventListener("click", () => {
          showTrainerCard(trainer, listItem, trainerElements); // Pasar referencia al elemento y lista
          sessionStorage.setItem("selectedTrainer", JSON.stringify(trainer)); // Guarda el Pokémon seleccionado
      });

      // Añade el elemento <li> al contenedor de la lista
      listElement.appendChild(listItem);
      trainerElements.push(listItem); // Guardar la referencia del <li>
  });

  // Verificar si hay un Trainer seleccionado en sessionStorage
  const storedTrainer = sessionStorage.getItem("selectedTrainer");
  if (storedTrainer) {
      const trainer = JSON.parse(storedTrainer);

      const index = trainerData.findIndex(t => t.name === trainer.name); // Buscar índice del entrenador guardado
      showTrainerCard(trainer, trainerElements[index], trainerElements); // Resaltar entrenador guardado
      sessionStorage.removeItem("selectedTrainer"); // Limpia el almacenamiento luego de cargar el detalle
  } else {
      // Si no hay Pokémon seleccionado, muestra el primer Pokémon
      if (trainerData.length > 0) {
          showTrainerCard(trainerData[0], trainerElements[0], trainerElements); // Mostrar el primero si no hay guardado
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
    bashful: "Bashful (+Sp. Atk / -Sp. Atk)",
    bold: "Bold (+Def / -Atk)",
    brave: "Brave (+Atk / -Spe)",
    calm: "Calm (+Sp. Def / -Atk)",
    careful: "Careful (+Sp. Def / -Sp. Atk)",
    docile: "Docile (+Def / -Def)",
    gentle: "Gentle (+Sp. Def / -Def)",
    hardy: "Hardy (+Atk / -Atk)",
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
    quirky: "Quirky (+Sp. Def / -Sp. Def)",
    rash: "Rash (+Sp. Atk / -Sp. Def)",
    relaxed: "Relaxed (+Def / -Spe)",
    sassy: "Sassy (+Sp. Def / -Spe)",
    serious: "Serious (+Spe / -Spe)",
    timid: "Timid (+Spe / -Atk)",
  };

    // Función para buscar un Pokémon por nombre en pokemonData
    function findPokemonByName(name, pokemonData) {
        return pokemonData.find(pokemon => pokemon.name.toLowerCase() === name.toLowerCase());
    }

  // Función para mostrar la tarjeta de entrenadores
    function showTrainerCard(trainer, selectedElement, trainerElements) {
        
      // Resaltar el elemento seleccionado
      trainerElements.forEach(item => item.classList.remove("selected-trainer")); // Quitar la clase de todos
      selectedElement.classList.add("selected-trainer"); // Agregar la clase al seleccionado
      
      // Mostrar la información del entrenador en el DOM
        trainerSection.innerHTML = `
          <div class="trainer-card"> 
            <div class="trainer1"> 
              <h2 class="orden">${trainer.Orden}</h2>
                <h3 class="numeroDeOrden"> ${trainer.variant} </h3>
              <img src="./images/trainers/${trainer.name}.png" alt="${trainer.name}" class="trainer-img">  
              <h2>${trainer.name} </h2>
              <div class="tipo">${trainer.tipo}</div> <!-- Obligatorio u opcional --> 
              <div class="Tipo-Combate">${trainer.tipo_de_combate}</div>
            </div>

      <div class="trainer2">
          <div class="header">
    
              <h3 class="nombre-entrenador">${trainer.descripcion_de_entrenador}</h3>
              <div class="cantPokemon">
                  <img src="./images/pokeball4.png" alt="#Pokemons" class="pokeballIMG">
                  <h3>#${trainer.num_pokemon}</h3>
              </div>
          </div>
          <div class="objCurativo">
              <img src="./images/pocion.png" alt="#Pokemons" class="pokeballIMG">
              <h3>${trainer.healing_item || "Ninguna"}</h3>
          </div>
          <h2 class="ubicacion">${trainer.ubicacion}</h2>
      </div>


            <div class="trainer3">
              <div class="resumenPokemon">
                ${trainer.pokemons
                  .concat(Array(6 - trainer.pokemons.length).fill({ name: "noPokemon" }))
                  .slice(0, 6)
                  .map(pokemon => `
                    <a href="/pokemon-details.html?name=${pokemon.name}.html">
                    <img src="./images/pokemon/${pokemon.name}.png" alt="${pokemon.name}" >
                    </a>
                  `).join("")}
              </div>
            </div>


            </div>
        `;
        
        // Mostrar los detalles de los Pokémon del entrenador
        pokemonSection.innerHTML = ""; // Limpiar el área de los detalles del Pokémon
        const movesData = JSON.parse(sessionStorage.getItem("movesData"));
        const abilitiesData = JSON.parse(sessionStorage.getItem("abilitiesData"));
        const pokemonData = JSON.parse(sessionStorage.getItem("pokemonData"));


        trainer.pokemons.forEach((pokemon, index) => {
          // Buscar el Pokémon en los datos de pokemonData
          const pokemonDetails = findPokemonByName(pokemon.name, pokemonData);
      
          if (pokemonDetails) {
              // Manejo de tipos con colores
              const typeHTML = pokemonDetails.type.map((type) =>
                  `<span class="type" style="background-color: ${typeColors[type] || "#000"}">${type}</span>`).join(" ");
      
              // Manejo de movimientos del Pokémon
              const movesHTML = pokemon.moves.map((move) => {
                const moveDetails = movesData.find(m => m.name_en.toLowerCase() === move.toLowerCase());
                if (moveDetails) {
                    return `
                        <div class="moveTypeWrapper">
                            <img src="/images/pokemon/moves/${moveDetails.type.toLowerCase()}.png" alt="${moveDetails.type} Type">
                           
                            
                            <p class="move-tooltip" data-description="${moveDetails.description}">
                            ${moveDetails.name_es}
                            </p>

                            <img src="/images/pokemon/moves/${moveDetails.category.toLowerCase()}.png" alt="${moveDetails.category} Move">
                            <div class="PowerBox"><p>Power</p><p>${moveDetails.power}</p></div>
                            <div class="AccBox"><p>Acc</p><p>${moveDetails.accuracy}</p></div>
                        </div>
                    `;
                } else {
                    return `
                        <div class="moveTypeWrapper">
                            <p>${move}555</p>
                        </div>
                    `;
                }
            }).join("");

            // Obtener habilidades
            const abilitiesHTML = getAbilitiesHTML(
              pokemonDetails,
              pokemon.ability,
              abilitiesData
          );
          console.log(pokemon.ability);
              //creo la Card
              const card = document.createElement("div");
              
              // Asignar múltiples clases dinámicas desde pkm1 hasta pkmX
              card.className = `pokemon-card pkm${index + 1}`;
              
              // Card HTML
              card.innerHTML = `
               <h3>${pokemon.name}</h3>  
              <img src="./images/pokemon/${pokemon.name}.png" alt="${pokemon.name}" class="pokemonIMG">
                  <div>
                      
                      <div class="flex">
                          <p>${typeHTML}</p>
                      </div>
                      <h3>Level ${pokemon.level}</h3>
                      <hr>

                      <div class="abilities">${abilitiesHTML}</div>

                      <hr>
                      <div class="itemImgWrapper">
                          <p class="noItem">${pokemon.item ? capitalizeFirstWord(pokemon.item) : "Sin Objeto"}</p>
                      </div>
                      <div class="nature">
                          <p>${natureTypes[pokemon.nature.toLowerCase()] || "Naturaleza Desconocida"}</p>
                      </div>
                      ${movesHTML} <!-- Inserta aquí todas las divs de movimientos -->
                  </div>
              `;

              pokemonSection.appendChild(card);
          } else {
              console.log("Pokémon no encontrado: " + pokemon.name);
          }
      });
      
    }

    // Obtener HTML de habilidades
    function getAbilitiesHTML(pokemonDetails, abilityIndex, abilitiesData) {
      // Clonar las habilidades comunes del Pokémon
      let abilitiesToShow = [...pokemonDetails.abilities];

      if (pokemonDetails.hidden_ability) {
        abilitiesToShow.push(pokemonDetails.hidden_ability);
      }      
      //console.log(abilitiesToShow);
      // Ajustar la lógica según el índice
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
      
      //console.log(pokemonDetails.name+ " abilityIndex: " +abilityIndex);
      //console.log(abilitiesToShow);

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

    searchBar.addEventListener("input", () => {
        const query = searchBar.value.toLowerCase();
        const trainerData = JSON.parse(sessionStorage.getItem("trainerData")); // Asegúrate de recuperar los datos
        const listItems = listElement.querySelectorAll("li");
        let firstVisibleTrainer = null;
      
        listItems.forEach((item, index) => {
          const trainerName = item.textContent.toLowerCase();
          if (trainerName.includes(query)) {
            item.style.display = "flex"; // Muestra los entrenadores coincidentes
            if (!firstVisibleTrainer) {
                firstVisibleTrainer = trainerData[index]; // Asocia al Pokémon correcto
            }
          } else {
            item.style.display = "none"; // Oculta los Pokémon que no coinciden
          }
        });
      
        // Mostrar detalles del primer entrenador visible
        if (firstVisibleTrainer) {
            showTrainerCard(firstVisibleTrainer);
        }
      });

/*
{
    "sprite": "LIDER1",
    "name": "Brock",
    "variant": 1,
    "num_pokemon": 3,
    "healing_item": "SUPERPOTION",
    "pokemons": [
        {
            "name": "DWEBBLE",
            "level": 12,
            "item": null,
            "moves": [
                "BUGBITE",
                "ROCKTOMB",
                "SANDATTACK",
                "STEALTHROCK"
            ],
            "ability": "1",
            "nature": "QUIRKY"
        },
        {
            "name": "BONSLY",
            "level": 12,
            "item": "MUSCLEBAND",
            "moves": [
                "ROCKTOMB",
                "ABRECAMINOS",
                "ROCKSMASH",
                "FLAIL"
            ],
            "ability": "0",
            "nature": "QUIRKY"
        },
        {
            "name": "ONIX",
            "level": 14,
            "item": null,
            "moves": [
                "ROCKTOMB",
                "SANDTOMB",
                "SANDSTORM",
                "ROAR"
            ],
            "ability": "1",
            "nature": "QUIRKY"
        }
    ]
},
*/


// Referencia a los botones de radio
const starterRadios = document.querySelectorAll('input[name="starter"]');
const dificultadRadios = document.querySelectorAll('input[name="dificultad"]');

// Función para filtrar entrenadores según el Pokémon inicial
function filterTrainersByStarter(trainerData, starter) {
  const filteredData = trainerData.filter((trainer) => {
    if (trainer.name === "Azul") {
      if (starter === "Bulbasaur" && (trainer.sprite === "AZULALIADO1" || trainer.sprite === "AZULALIADO2" || trainer.variant === 2 || trainer.variant === 3 || trainer.variant === 5 || trainer.variant === 6)) {
        return false; // Azul tiene Charmander - Excluir variantes 2 y 3 y 5 6
      }
      if (starter === "Charmander" && (trainer.sprite === "AZULALIADO2" || trainer.sprite === "AZULALIADO0" || trainer.variant === 1 || trainer.variant === 3|| trainer.variant === 4 || trainer.variant === 6)) {
        return false; // Azul tiene Squirtle - Excluir variantes 1 y 3 y 4 y 6
      }
      if (starter === "Squirtle" && (trainer.sprite === "AZULALIADO1" || trainer.sprite === "AZULALIADO0" || trainer.variant === 2 || trainer.variant === 1|| trainer.variant === 4 || trainer.variant === 5)) {
        return false; // Azul tiene Bulbasaur - Excluir variantes 2 y 1 y 4 y 5
      }
    }
    if (trainer.name === "Rojo") {
      if (starter === "Bulbasaur" && (trainer.variant === 1 || trainer.variant === 3 || trainer.variant === 4 || trainer.variant === 6)) {
        return false; // Rojo tiene squirtle Excluir variantes 1 y 3 y 4 y 6
      }
      if (starter === "Charmander" && (trainer.variant === 2 || trainer.variant === 1|| trainer.variant === 4 || trainer.variant === 5)) {
        return false; // Rojo tiene Bulbasaur - Excluir variantes 2 y 1 y 4 y 5
      }
      if (starter === "Squirtle" && (trainer.variant === 2 || trainer.variant === 3 || trainer.variant === 5 || trainer.variant === 6)) {
        return false; // Rojo tiene Charmander - Excluir variantes 2 y 3 y 5 6
      }
    }
    return true; // Incluir el resto
  });

  return filteredData;
}

// Función para filtrar entrenadores según la dificultad
function filterTrainersByDificultad(trainerData, dificultad) {
  const filteredData = trainerData.filter((trainer) => {

    if (dificultad === "Clasico") dificultad = null
    if (dificultad === "Completo") dificultad = 1
    if (dificultad === "Radical") dificultad = 2
    console.log("yo acaaaa"+dificultad);

    if (trainer.Orden === 0){
      return false; //Excluyo todos los encuentros normales y dejo los importantes
    }
    if (trainer.name === "Rojo" || trainer.name === "Azul") {
      if (trainer.Orden === 0){
        return false; //Excluyo todos los encuentros normales y dejo los importantes
      }
      if (trainer.sprite === "AZUL1"){
        const nothing = "No hago nada"
      }else{
        if (trainer.variant !== null){
          if (dificultad === 2){
            if (trainer.variant <= 3){
              return false;
            }          
          }else{
            if(trainer.variant > 3){
              return false;
            }
          }
        }
      }
    }else{
      
      if (trainer.sprite.includes("HOENN") || (trainer.Orden >= 45 && trainer.Orden <= 59) ){
        //no hace nada
      }else{
        if (dificultad === 2 && (trainer.sprite === "AGATHA1" || trainer.sprite === "MOTORISTA" || trainer.sprite ===  "KARATEKA")){
          if (trainer.variant === null){
            return false;
          }
        }else{
          if (trainer.variant !== dificultad){
            return false; //Excluye los que no sean la dificultad seleccionada
          }
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
  const selectedDificultad = document.querySelector('input[name="dificultad"]:checked')?.value;
  
  if (selectedStarter && selectedDificultad) {
    const trainerData = JSON.parse(sessionStorage.getItem("trainerData"));
    
    //Filtramos por poquemon inicial
    const filteredData = filterTrainersByStarter(trainerData, selectedStarter);
    
    //Filtramos por tipo de dificultad
    const filteredData2 = filterTrainersByDificultad(filteredData, selectedDificultad);
    
    listElement.innerHTML = ""; // Limpiar la lista
    populateTrainersList(filteredData2); // Rellenar la lista con datos filtrados
  }
}

// Asignar el evento a los botones de radio
starterRadios.forEach((radio) => {
  radio.addEventListener("change", handleStarterChange);
});

dificultadRadios.forEach((radio) => {
  radio.addEventListener("change", handleStarterChange);
});

// Modificar init para inicializar con todos los entrenadores
async function init() {
  await loadPokemon();
  await loadTrainers();
  await loadMoves();
  await loadAbilities();

  // Seleccionar valores iniciales
  document.getElementById("bulbasaur").checked = true;
  document.getElementById("Radical").checked = true;

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


  