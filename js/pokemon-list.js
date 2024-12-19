// Ruta al archivo JSON
const jsonPath = "./data/pokemon.json";

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
const BarColors = {
  HP: "#78C850",
  ATTACK: "#F08030",
  DEFENSE: "#F08030",
  SPEED: "#A8B820",
  Normal: "#A8A878",
  SP_ATTACK: "#F8D030",
  SP_DEFENSE: "#F8D030",
};



// Elementos del DOM
const listElement = document.getElementById("list");
const detailsElement = document.getElementById("details");

// Función para cargar el JSON
async function loadPokemon() {
  try {
    const response = await fetch(jsonPath);
    const pokemonData = await response.json();
    sessionStorage.setItem("pokemonData", JSON.stringify(pokemonData)); // Almacena los datos en sessionStorage
    populateList(pokemonData); // Rellena la lista
  } catch (error) {
    console.error("Error loading Pokémon data:", error);
  }
}


// Función para rellenar la lista de Pokémon
function populateList(pokemonData) {
  // Recorre todos los datos de los Pokémon
  pokemonData.forEach((pokemon) => {
    // Crea un elemento <li> para cada Pokémon
    const listItem = document.createElement("li");
    
    // Inserta la imagen y el texto (número y nombre del Pokémon) dentro del <li>
    listItem.innerHTML = `
      <img src="./images/pokemon/${pokemon.name}.png" alt="${pokemon.name}" class="pokemon-icon">
      ${pokemon.number} - ${pokemon.name}
    `;
    
    // Agrega un evento "click" al elemento <li> que muestra los detalles del Pokémon seleccionado
    listItem.addEventListener("click", () => showDetails(pokemon));
    
    // Añade el elemento <li> al contenedor de la lista
    listElement.appendChild(listItem);
  });


  // Verificar si hay un Pokémon seleccionado en sessionStorage
  const storedPokemon = sessionStorage.getItem("selectedPokemon");
  if (storedPokemon) {
    const pokemon = JSON.parse(storedPokemon);
    showDetails(pokemon); // Muestra los detalles del Pokémon seleccionado
    sessionStorage.removeItem("selectedPokemon"); // Limpia el almacenamiento luego de cargar el detalle
  } else {
    // Si no hay Pokémon seleccionado, muestra el primer Pokémon
    if (pokemonData.length > 0) {
      showDetails(pokemonData[0]);
    }
  }
}
/* 
window.onload = () => {
  const storedPokemon = sessionStorage.getItem("selectedPokemon");
  if (storedPokemon) {
    const pokemon = JSON.parse(storedPokemon);
    showDetails(pokemon); // Muestra los detalles del Pokémon
    sessionStorage.removeItem("selectedPokemon"); // Limpia el almacenamiento
  }
};
*/
// Función para mostrar los detalles de un Pokémon
function showDetails(pokemon) {
  // Manejo de tipos con colores
  const typeHTML = pokemon.type
    .map(
      (type) =>
        `<span class="type" style="background-color: ${
          typeColors[type] || "#000"
        }">${type}</span>`
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
          <p class="label">${stat.toUpperCase()}</p>
          <p class="statVal">${value}</p>
          <div class="bar" style="width: ${
            (value / maxStatValue) * 100
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

  // Actualizar los detalles del Pokémon en el DOM
  detailsElement.innerHTML = `
    <h3>${pokemon.name} (#${pokemon.number})</h3>
    <img src="./images/pokemon/${pokemon.name}.png" alt="${pokemon.name}" class="pokemon-image">
    <p><strong>Internal Name:</strong> ${pokemon.InternalName}</p>
    <p><strong>Type:</strong> ${typeHTML}</p>
    <p><strong>Base Stats:</strong></p>
    <div class="statBlock">${statsHTML}${totalHTML}</div>
    <p><strong>Pokedex Description:</strong> ${pokemon.pokedex_description}</p>
  `;
}

const searchBar = document.getElementById("search-bar");

searchBar.addEventListener("input", () => {
  const query = searchBar.value.toLowerCase();
  const pokemonData = JSON.parse(sessionStorage.getItem("pokemonData")); // Asegúrate de recuperar los datos
  const listItems = listElement.querySelectorAll("li");
  let firstVisiblePokemon = null;

  listItems.forEach((item, index) => {
    const pokemonName = item.textContent.toLowerCase();
    if (pokemonName.includes(query)) {
      item.style.display = "flex"; // Muestra los Pokémon coincidentes
      if (!firstVisiblePokemon) {
        firstVisiblePokemon = pokemonData[index]; // Asocia al Pokémon correcto
      }
    } else {
      item.style.display = "none"; // Oculta los Pokémon que no coinciden
    }
  });

  // Mostrar detalles del primer Pokémon visible
  if (firstVisiblePokemon) {
    showDetails(firstVisiblePokemon);
  }
});


// Cargar los datos al cargar la página
loadPokemon();
