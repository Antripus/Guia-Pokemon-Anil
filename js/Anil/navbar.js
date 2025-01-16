if (!window.navbarInitialized) {
  window.navbarInitialized = true;

    let selectedIndex = -1;  // Para controlar la selección del dropdown
    let links = [];  // Para almacenar los enlaces generados en el dropdown
    const navbarSearch = document.getElementById("navbar-search");  // Declarar navbarSearch globalmente

    // Determinar qué archivo JSON cargar según la página activa
    function getPokemonDataFile() {
      const navbarLinks = document.querySelectorAll("#navbar a");
      let dataFile = "./data/Anil/pokemon.json"; // Predeterminado
      console.log("navbarLinks:", navbarLinks);
    
      navbarLinks.forEach(link => {
        if (link.classList.contains("active")) {
          const href = link.href.toLowerCase(); // Asegura coincidencia insensible a mayúsculas
          if (href.includes("opalo-index")) {
            dataFile = "./data/Opalo/pokemon.json";
          } else if (href.includes("anil-index")) {
            dataFile = "./data/Anil/pokemon.json";
          }
        }
        console.log("Links:", link.href, link.classList);
      });
    
      console.log("Archivo seleccionado:", dataFile);
      console.log("URL actual:", window.location.href);
      console.log("Enlaces en la barra de navegación:", navbarLinks);
    
      return dataFile;
    }
    

    function isSessionStorageAvailable() {
      try {
          const testKey = '__test__';
          sessionStorage.setItem(testKey, 'test');
          sessionStorage.removeItem(testKey);
          return true;
      } catch (error) {
          console.error("Session storage is not available:", error);
          return false;
      }
 
    }
  
    // Función para cargar datos de Pokémon en sessionStorage si no están presentes
    async function ensurePokemonDataLoaded() {
      try {
        const dataFile = getPokemonDataFile(); // Define la variable dentro de la función
        if (
          isSessionStorageAvailable() &&
          (!sessionStorage.getItem("navbarPokemonData") || sessionStorage.getItem("currentDataFile") !== dataFile)
        ) {
          console.log("Cargando datos desde:", dataFile);
    
          const response = await fetch(dataFile);
          const pokemonData = await response.json();
    
          sessionStorage.setItem("navbarPokemonData", JSON.stringify(pokemonData));
          sessionStorage.setItem("currentDataFile", dataFile);
        }
      } catch (error) {
        console.error("Error loading Pokémon data:", error);
      }
    }
    

    // Función para manejar la búsqueda en la barra de navegación
    function setupNavbarSearch() {
      navbarSearch.addEventListener("input", () => {
        const storedData = sessionStorage.getItem("navbarPokemonData");
        if (!storedData) {
          console.error("No Pokémon data available for search.");
          return;
        }
    
        const pokemonData = JSON.parse(storedData);
        const query = navbarSearch.value.toLowerCase();
    
        const filteredPokemon = pokemonData.filter(pokemon =>
          pokemon.name.toLowerCase().includes(query)
        );
    
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
          // Guarda el Pokémon seleccionado en sessionStorage
          sessionStorage.setItem("selectedPokemon", JSON.stringify(pokemon));
        
          // Obtén el archivo actual desde sessionStorage
          const currentDataFile = sessionStorage.getItem("currentDataFile");
        
          // Define la redirección según el archivo actual
          if (currentDataFile && currentDataFile.includes("Opalo")) {
            window.location.href = `Opalo-pokemon-details.html?number=${pokemon.number}`;
          } else if (currentDataFile && currentDataFile.includes("Anil")) {
            window.location.href = `Anil-pokemon-details.html?number=${pokemon.number}`;
          } else {
            console.warn("No se pudo determinar el archivo actual, redirigiendo a una página predeterminada.");
            window.location.href = `Anil-pokemon-details.html?number=${pokemon.number}`; // O un fallback
          }
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
    

    //ensurePokemonDataLoaded().then(setupNavbarSearch);

    if (isSessionStorageAvailable()) {
      ensurePokemonDataLoaded().then(setupNavbarSearch);
      console.log("Navbar search initialized");
    } else {
        console.warn("Session storage is unavailable. Some features may not work.");
    }

}


document.addEventListener("DOMContentLoaded", function () {
  const navbarLinks = document.querySelectorAll("#navbar a");
  const currentUrl = window.location.pathname;
  //const currentUrl = window.location.pathname.split("/").pop(); // Solo el archivo


  navbarLinks.forEach(link => {
      if (link.href.includes(currentUrl)) {
          link.classList.add("active");
      }
  });
});
