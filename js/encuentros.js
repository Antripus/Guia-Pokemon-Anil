const trainerData = {
    name: "Youngster Austin",
    team: [
      {
        name: "Zigzagoon",
        level: 6,
        type: ["Normal"],
        ability: "Quick Feet",
        item: "No Item",
        nature: "Hasty (+Spe / -Def)",
        ivs: 31,
        moves: ["Covet", "Sand Attack", "Growl", "Tail Whip"],
      },
      {
        name: "Bunnelby",
        level: 6,
        type: ["Normal"],
        ability: "Cheek Pouch",
        item: "Oran Berry",
        nature: "Naughty (+Atk / -SpD)",
        ivs: 31,
        moves: ["Bulldoze", "Quick Attack", "Leer"],
      },
    ],
  };
  
  // Función para mostrar la información del entrenador
  function displayTrainerInfo(trainer) {
    const trainerSection = document.getElementById("trainer-info");
    trainerSection.innerHTML = `
      <h2>${trainer.name}</h2>
      <button>Single Battle</button>
    `;
  }
  
  // Función para mostrar detalles de los Pokémon
  function displayPokemonDetails(team) {
    const pokemonSection = document.getElementById("pokemon-details");
    pokemonSection.innerHTML = "";
    team.forEach((pokemon) => {
      const card = document.createElement("div");
      card.className = "pokemon-card";
      card.innerHTML = `
        <img src="./images/pokemon/${pokemon.name}.png" alt="${pokemon.name} class="pokemonIMG"">
        <div>
          <h3>${pokemon.name}</h3>
          <p>Level: ${pokemon.level}</p>
          <p>Type: ${pokemon.type.join(", ")}</p>
          <p>Ability: ${pokemon.ability}</p>
          <p>Item: ${pokemon.item}</p>
          <p>Nature: ${pokemon.nature}</p>
          <p>IVs: ${pokemon.ivs}</p>
          <p>Moves: ${pokemon.moves.join(", ")}</p>
        </div>
      `;
      pokemonSection.appendChild(card);
    });
  }
  
  // Función principal para inicializar la página
  function init() {
    displayTrainerInfo(trainerData);
    displayPokemonDetails(trainerData.team);
  }
  
  // Inicializa la página cuando carga
  document.addEventListener("DOMContentLoaded", init);

  