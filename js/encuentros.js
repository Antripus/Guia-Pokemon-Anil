
// Ruta de los archivos JSON
const jsonPathPokemon = "./data/pokemon.json";
const jsonPathTrainers = "./data/trainers.json";

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
    
    // Recorre todos los datos de los Trainers
    trainerData.forEach((trainer) => {
      
        // Crea un elemento <li> para cada Trainer
      const listItem = document.createElement("li");
      
      // Inserta la imagen y el texto (número y nombre del Pokémon) dentro del <li>
      listItem.innerHTML = `
        <img src="./images/trainers/${trainer.name}.png" alt="${trainer.name}" class="trainer-icon">
        ${trainer.name} - ${trainer.variant}
      `;
      
      // Agrega un evento "click" al elemento <li> que muestra los detalles del Pokémon seleccionado
      listItem.addEventListener("click", () => showTrainerCard(trainer));
      
      // Añade el elemento <li> al contenedor de la lista
      listElement.appendChild(listItem);
    });

    // Verificar si hay un Trainer seleccionado en sessionStorage
    const storedTrainer = sessionStorage.getItem("selectedTrainer");
    if (storedTrainer) {
        const trainer = JSON.parse(storedTrainer);
        showTrainerCard(storedTrainer); // Muestra los detalles del Trainer seleccionado
        sessionStorage.removeItem("selectedTrainer"); // Limpia el almacenamiento luego de cargar el detalle
    } else {
        // Si no hay Pokémon seleccionado, muestra el primer Pokémon
        if (trainerData.length > 0) {
            showTrainerCard(trainerData[0]);
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
    function showTrainerCard (trainer) {
        // Mostrar la información del entrenador en el DOM
        trainerSection.innerHTML = `
            <div class="trainerName"> <h2>${trainer.name} </h2> 
            <h2>Variante:  ${trainer.variant}</h2></div>
            <img src="./images/trainers/${trainer.name}.png" alt="${trainer.name}" class="trainer-img">
            <div>Single Battle</div>
            <div> <p> Cant de Pokemon: ${trainer.num_pokemon} </p> <p> Objetos curativos: ${trainer.healing_item || "Ninguno"} </p>  </div>
        `;
        
        // Mostrar los detalles de los Pokémon del entrenador
        pokemonSection.innerHTML = ""; // Limpiar el área de los detalles del Pokémon

        trainer.pokemons.forEach((pokemon) => {
            // Buscar el Pokémon en los datos de pokemonData
            const pokemonData = JSON.parse(sessionStorage.getItem("pokemonData"));
            const pokemonDetails = findPokemonByName(pokemon.name, pokemonData); // Buscar el Pokémon por nombre en pokemonData
            console.log(pokemonDetails.name);

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
            item.style.display = "flex"; // Muestra los Pokémon coincidentes
            if (!firstVisibleTrainer) {
                firstVisibleTrainer = trainerData[index]; // Asocia al Pokémon correcto
            }
          } else {
            item.style.display = "none"; // Oculta los Pokémon que no coinciden
          }
        });
      
        // Mostrar detalles del primer Pokémon visible
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

  
  // Función principal para inicializar la página
  function init() {
    //displayTrainerInfo(trainerData);
    //displayPokemonDetails(trainerData.team);
    loadPokemon()
    loadTrainers()
  }


  
  // Inicializa la página cuando carga
  document.addEventListener("DOMContentLoaded", init);

