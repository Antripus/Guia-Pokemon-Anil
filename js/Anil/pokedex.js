const jsonPath = "./data/Anil/pokemon.json";
const pokemonListElement = document.getElementById("pokemon-list");

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

// Cargar los datos de los Pokémon
async function loadPokemon() {
  try {
    const response = await fetch(jsonPath);
    const pokemonData = await response.json();
    displayPokemon(pokemonData);
  } catch (error) {
    console.error("Error loading Pokémon data:", error);
  }
}

// Mostrar el listado de Pokémon
function displayPokemon(pokemonData) {
  pokemonListElement.innerHTML = "";
  pokemonData.forEach((pokemon) => {
    const pokemonItem = document.createElement("div");
    pokemonItem.classList.add("pokemon-item");
    pokemonItem.innerHTML = `
      <img src="./images/pokemon/${pokemon.name}.png" alt="${pokemon.name}" loading="lazy">
      <span>${pokemon.number}</span>
      <span>${pokemon.name}</span>
      <div class="types">
        ${pokemon.type.map(type => `<span class="type" style="background-color: ${typeColors[type]};">${type}</span>`).join(' ')}
      </div>
    `;
    pokemonItem.addEventListener("click", () => {
      //window.location.href = `Anil-pokemon-details.html?number=${pokemon.number}`;
      window.open(`Anil-pokemon-details.html?number=${pokemon.number}`, '_blank');
    });

    
    pokemonListElement.appendChild(pokemonItem);
  });
}

// Función de búsqueda
function searchPokemon() {
  const searchQuery = document.getElementById("search-bar").value.toLowerCase();
  const pokemonItems = document.querySelectorAll(".pokemon-item");

  pokemonItems.forEach((item) => {
    const name = item.querySelector(".pokemon-item span:nth-child(3)").textContent.toLowerCase();
    if (name.includes(searchQuery)) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
}

// Cargar los datos al cargar la página
loadPokemon();
