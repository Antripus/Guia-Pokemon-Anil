document.addEventListener("DOMContentLoaded", () => {
    fetch("data/Anil/trainers.json")
      .then(response => response.json())
      .then(data => {
        const trainerList = document.getElementById("trainer-list");
        const trainerDetails = document.querySelector(".trainer-details");
  
        data.forEach((trainer, index) => {
          // Crear lista de entrenadores
          const listItem = document.createElement("li");
          listItem.textContent = trainer.name;
          listItem.addEventListener("click", () => {
            // Mostrar detalles del entrenador
            trainerDetails.innerHTML = `
              <h2>${trainer.name}</h2>
              <h3>Equipo:</h3>
              <ul>
                ${trainer.team.map(pokemon => `
                  <li>
                    <strong>${pokemon.pokemon}</strong> (Nivel ${pokemon.level})
                    <ul>
                      <li>Habilidades: ${pokemon.abilities.join(", ")}</li>
                      <li>Movimientos: ${pokemon.moves.join(", ")}</li>
                    </ul>
                  </li>
                `).join("")}
              </ul>
            `;
          });
          trainerList.appendChild(listItem);
        });
      })
      .catch(error => console.error("Error al cargar entrenadores:", error));
  });
  