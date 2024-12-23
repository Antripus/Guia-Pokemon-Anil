if (!window.navbarInitialized) {
  window.navbarInitialized = true;

    let selectedIndex = -1;  // Para controlar la selección del dropdown
    let links = [];  // Para almacenar los enlaces generados en el dropdown
    const navbarSearch = document.getElementById("navbar-search");  // Declarar navbarSearch globalmente


    // Función para cargar datos de Pokémon en sessionStorage si no están presentes
    async function ensurePokemonDataLoaded() {
      if (!sessionStorage.getItem("pokemonData")) {
        try {
          const response = await fetch("./data/pokemon.json");
          const pokemonData = await response.json();
          sessionStorage.setItem("pokemonData", JSON.stringify(pokemonData));
        } catch (error) {
          console.error("Error loading Pokémon data:", error);
        }
      }
    }

    // Función para manejar la búsqueda en la barra de navegación
    function setupNavbarSearch() {
      navbarSearch.addEventListener("input", () => {
        const query = navbarSearch.value.toLowerCase();
        const pokemonData = JSON.parse(sessionStorage.getItem("pokemonData"));

        if (!pokemonData) {
          console.error("No Pokémon data available for search.");
          return;
        }

        // Filtrar los Pokémon que coincidan con la consulta
        const filteredPokemon = pokemonData.filter(pokemon =>
          pokemon.name.toLowerCase().includes(query)
        );

        // Mostrar resultados sugeridos en el dropdown
        displayDropdownResults(filteredPokemon);
      });

      // Escuchar las teclas presionadas para las flechas y Enter
      navbarSearch.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown" && selectedIndex < links.length - 1) {
          selectedIndex++;
          updateDropdownSelection();
        } else if (e.key === "ArrowUp" && selectedIndex > 0) {
          selectedIndex--;
          updateDropdownSelection();
        } else if (e.key === "Enter" && selectedIndex !== -1) {
          // Redirigir al enlace seleccionado
          links[selectedIndex].click();  // Esto simula un clic en el enlace seleccionado
          navbarSearch.value = '';  // Limpiar el campo de búsqueda

          // Cerrar el dropdown
          document.getElementById("dropdownContent").style.display = "none";
        } else if (e.key === "Escape") {
          navbarSearch.value = '';  // Limpiar la barra de búsqueda
          document.getElementById("dropdownContent").style.display = "none";
        }
      });
    }

    // Función para mostrar resultados en el dropdown
    function displayDropdownResults(filteredPokemon) {
      let dropdown = document.getElementById("dropdownContent");
      if (!dropdown) {
        // Crear el contenedor si no existe
        dropdown = document.createElement("div");
        dropdown.id = "dropdownContent";
        dropdown.style.position = "absolute";
        dropdown.style.zIndex = "10";
        document.getElementById("GralSearchBar").appendChild(dropdown);
      }

      dropdown.innerHTML = "";  // Limpiar resultados anteriores
      links = [];  // Limpiar los links previos

      filteredPokemon.forEach(pokemon => {
        const link = document.createElement("a");
        link.textContent = `${pokemon.number} - ${pokemon.name}`;
        link.href = "#";  // Mantiene la misma página
        
        // Guardar el enlace
        links.push(link);
        /*
        link.addEventListener("click", () => {
          showDetails(pokemon);  // Mostrar los detalles del Pokémon en la misma página
          navbarSearch.value = '';  // Limpiar la barra de búsqueda al hacer clic
          dropdown.style.display = 'none';  // Opcional: ocultar el dropdown después de la selección
        });
    */
        link.addEventListener("click", () => {
            sessionStorage.setItem("selectedPokemon", JSON.stringify(pokemon)); // Guarda el Pokémon seleccionado
            window.location.href = "pokemons-list.html"; // Redirige a la página sin parámetros

        });

        
        dropdown.appendChild(link);
      });

      dropdown.style.display = filteredPokemon.length > 0 ? "block" : "none";
      selectedIndex = -1;  // Resetear selección
    }

    // Actualizar la selección del dropdown
    function updateDropdownSelection() {
      links.forEach((link, index) => {
        link.style.backgroundColor = index === selectedIndex ? "#ddd" : "";  // Resaltar la opción seleccionada
      });
    }

    // Función para cerrar el dropdown al hacer clic en cualquier lugar
    function closeDropdownOnClickOutside(event) {
      const dropdown = document.getElementById("dropdownContent");
      const searchBar = document.getElementById("navbar-search");

        // Si no existe el dropdown o el searchBar, no hacer nada
        if (!searchBar || !dropdown) return;
      // Si el clic no fue dentro del dropdown o en la barra de búsqueda, cierra el dropdown
      if (!dropdown.contains(event.target) && event.target !== searchBar) {
        dropdown.style.display = "none";
      }
    }

    // Añadir el evento de clic al documento
    document.addEventListener("click", closeDropdownOnClickOutside);

    // Inicializar la funcionalidad de búsqueda en la barra de navegación
    console.log("Navbar search initialized");

    ensurePokemonDataLoaded().then(setupNavbarSearch);


}
