// Barra de búsqueda en la navegación
const navbarSearch = document.getElementById("navbar-search");

navbarSearch.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();

  // Lógica de búsqueda global (si es necesario)
  console.log(`Buscando: ${query}`);
});
