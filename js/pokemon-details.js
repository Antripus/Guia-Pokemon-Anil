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

function chequearLeftAndRight (pokemonNumber){
    if (pokemonNumber< 1){
        1
    } 
    if (pokemonNumber> 1004){
        1004
    } 
}


function displayPokemonDetails(pokemon) {
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
        <p class="label">${ShortStats[stat.toUpperCase()]}</p>
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

  detailsElement.innerHTML = `
    <div id="pkmGrid">
        <div id="topPanel">
        <a id="goLeft" href=pokemon-details.html?number=${pokemon.number-1}> Go Left </a>
        <h1 id="pkmName">${pokemon.name} (#${pokemon.number})</h1>
        <a id="goRight" href=pokemon-details.html?number=${pokemon.number+1}> Go Right </a>
        </div>

        <img src="./images/pokemon/${pokemon.name}.png" alt="${pokemon.name}" class="pokemon-image">
        
        <p><strong>Abilities:</strong> ${pokemon.abilities}</p>
        <p><strong>Hidden Ability:</strong> ${pokemon.hidden_ability}</p>
        <p><strong>Type:</strong> ${typeHTML}</p>
        <p><strong>Base Stats:</strong></p>
        <div class="statBlock">${statsHTML}${totalHTML}</div>
        <p><strong>Pokedex Description:</strong> ${pokemon.pokedex_description}</p>
    </div>
    `;

}

loadPokemonDetails();
