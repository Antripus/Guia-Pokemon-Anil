
// Ruta de los archivos JSON
const jsonPathPokemon = "./data/pokemon.json";
const jsonPathTrainers = "./data/trainers_actualizados.json";

// Elementos del DOM
const listElement = document.getElementById("encounter-list");
const trainerSection = document.getElementById("trainer-info");
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
          <h3 class="numeroDePokemon"> ${trainer.Orden} </h3>
          <img src="./images/trainers/${trainer.name}.png" alt="${trainer.name}">
          <h3 class="nombreEntrenador"> ${trainer.name} </h3> 
          <img src="./images/pokeball3.png" alt="#Pokemons" class="pokeballIMG"> 
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
    Fairy: "#EE99AC",
    Fighting: "#C03028",
    Flying: "#A890F0",
    Ghost: "#705898",
    Steel: "#B8B8D0"
  };

// Colores para cada tipo de Pokémon
const natureTypes = {
    Hasty: "(+Spe / -Def)",
    Adamant: "(+Atk / -Sp. Atk)",
    Bashful: "(+Sp. Atk / -Sp. Atk)",
    Bold: "(+Def / -Atk)",
    Brave: "(+Atk / -Spe)",
    Calm: "(+Sp. Def / -Atk)",
    Careful: "(+Sp. Def / -Sp. Atk)",
    Docile: "(+Def / -Def)",
    Gentle: "(+Sp. Def / -Def)",
    Hardy: "(+Atk / -Atk)",
    Hasty: "(+Spe / -Def)",
    Impish: "(+Def / -Sp. Atk)",
    Jolly: "(+Spe / -Sp. Atk)",
    Lax: "(+Def / -Sp. Def)",
    Lonely: "(+Atk / -Def)",
    Mild: "(+Sp. Atk / -Def)",
    Modest: "(+Sp. Atk / -Atk)",
    Naive: "(+Spe / -Sp. Def)",
    Naughty: "(+Atk / -Sp. Def)",
    Quiet: "(+Sp. Atk / -Spe)",
    Quirky: "(+Sp. Def / -Sp. Def)",
    Rash: "(+Sp. Atk / -Sp. Def)",
    Relaxed: "(+Def / -Spe)",
    Sassy: "(+Sp. Def / -Spe)",
    Serious: "(+Spe / -Spe)",
    Timid: "(+Spe / -Atk)",
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
            <div class="trainer1"> 
              <img src="./images/trainers/${trainer.name}.png" alt="${trainer.name}" class="trainer-img">  
              <h2>${trainer.name} </h2>
              <div class="tipo">${trainer.tipo}</div> <!-- Obligatorio u opcional --> 
              <div class="Tipo-Combate">${trainer.tipo_de_combate}</div>
              
            </div>
            <div class="trainer2"> 
            
            <h2>${trainer.Orden}-  ${trainer.descripcion_de_entrenador} </h2>

            <h2> ${trainer.ubicacion}</h2>
            
              
              <div class="objCurativo">
              <img src="./images/pocion.png" alt="#Pokemons" class="pokeballIMG">
              <h3>${trainer.healing_item || "Ninguna"} </h3>
              </div>
            <div class="cantPokemon">
                <img src="./images/pokeball2.png" alt="#Pokemons" class="pokeballIMG"> 
                <h3> #${trainer.num_pokemon} </h3> 
                </div>
            </div>
            
        `;
        
        // Mostrar los detalles de los Pokémon del entrenador
        pokemonSection.innerHTML = ""; // Limpiar el área de los detalles del Pokémon

        trainer.pokemons.forEach((pokemon) => {
            // Buscar el Pokémon en los datos de pokemonData
            const pokemonData = JSON.parse(sessionStorage.getItem("pokemonData"));
            const pokemonDetails = findPokemonByName(pokemon.name, pokemonData); // Buscar el Pokémon por nombre en pokemonData
            
            if (pokemonDetails) {
                // Si el Pokémon se encuentra en pokemonData, mostrar los detalles
        
                // Manejo de tipos con colores
                const typeHTML = pokemonDetails.type.map((type) =>
                    `<span class="type" style="background-color: ${typeColors[type] || "#000"}">${type}</span>`).join(" ");

                const card = document.createElement("div");
                card.className = "pokemon-card";
                card.innerHTML = `
                    <img src="./images/pokemon/${pokemon.name}.png" alt="${pokemon.name}" class="pokemonIMG">
                    <div>
                        <h3>${pokemon.name}</h3>
                        <p>Level: ${pokemon.level}</p>
                         <p><strong>Type:</strong> ${typeHTML}</p>
                        <p>Ability: ${pokemon.ability}</p>
                        <p>Item: ${pokemon.item}</p>
                        <p>Nature: ${pokemon.nature}</p>
                        <p>IVs: ${pokemon.ivs || "Unknown"}</p> <!-- Mostrar IVs, si están disponibles -->
                        <p>Moves: ${pokemon.moves.join(", ")}</p> <!-- Mostrar los movimientos -->
                    </div>
                `;
                pokemonSection.appendChild(card);
            } else {
                console.log("Pokémon no encontrado: " + pokemon.name);
            }
        });
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
        if (dificultad === 2 && (trainer.sprite === "AGATHA1" || trainer.sprite === "MOTORISTA" || trainer.sprite ===  "VETERANO")){
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
function init() {
  loadPokemon();
  loadTrainers();
  // Seleccionar el primer botón de radio por defecto (opcional)
  document.getElementById("bulbasaur").checked = true;
  document.getElementById("Radical").checked = true;
  handleStarterChange(); // Aplicar el filtro inicial
}

  
  /* Función principal para inicializar la página
  function init() {
    //displayTrainerInfo(trainerData);
    //displayPokemonDetails(trainerData.team);
    loadPokemon()
    loadTrainers()
  }*/


  
  // Inicializa la página cuando carga
  document.addEventListener("DOMContentLoaded", init);


  