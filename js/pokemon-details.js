const params = new URLSearchParams(window.location.search);
const pokemonNumber = params.get('number');
const detailsElement = document.getElementById("pokemon-details");

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

async function loadPokemonDetails() {
  try {
    const response = await fetch("./data/pokemon.json");
    const pokemonData = await response.json();
    const pokemon = pokemonData.find(p => p.number == pokemonNumber);
    if (pokemon) {
      displayPokemonDetails(pokemon);
    }
  } catch (error) {
    console.error("Error loading Pokémon details:", error);
  }
}

function displayPokemonDetails(pokemon) {
  const typeHTML = pokemon.type.map(type => `<span class="type" style="background-color: ${typeColors[type]};">${type}</span>`).join(' ');

  const statsHTML = Object.entries(pokemon.base_stats)
    .map(
      ([stat, value]) =>
        `<div class="grid">
          <p class="label">${stat.toUpperCase()}</p>
          <p class="statVal">${value}</p>
          <div class="bar" style="width: ${(value / 200) * 100}%; background-color: ${typeColors[stat] || "#ccc"};"></div>
        </div>`
    )
    .join("");

  detailsElement.innerHTML = `
    <h3>${pokemon.name} (#${pokemon.number})</h3>
    <img src="./images/${pokemon.number}.png" alt="${pokemon.name}" class="pokemon-image">
    <p><strong>Internal Name:</strong> ${pokemon.InternalName}</p>
    <p><strong>Type:</strong> ${typeHTML}</p>
    <p><strong>Base Stats:</strong></p>
    <div class="statBlock">${statsHTML}</div>
    <p><strong>Pokedex Description:</strong> ${pokemon.pokedex_description}</p>
  `;
}

loadPokemonDetails();
