document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("root");

  // 1. Traemos los cursos del backend
  async function obtenerCursos() {
    // obtener id de capacitador desde la cookie
    const idCapacitador = getCookie("id");
    if (!idCapacitador) {
      root.innerHTML = "<p>Debes iniciar sesión para ver los cursos.</p>";
      return;
    }
    try {
      // ❗ Cambia la URL por la de tu API real
      console.log(
        "http://dcwck8048o4ocowkwwwkksck.4.172.252.35.sslip.io/cursos/usuario/" +
          idCapacitador
      );
      const respuesta = await fetch(
        "http://dcwck8048o4ocowkwwwkksck.4.172.252.35.sslip.io/cursos/usuario/" +
          idCapacitador
      );

      // por si el servidor responde con error 4xx/5xx
      if (!respuesta.ok) throw new Error("Respuesta no OK");

      const cursos = await respuesta.json();
      mostrarCursos(cursos);
    } catch (error) {
      console.error("Error al cargar los cursos:", error);
      root.innerHTML = "<p>Error al cargar los cursos.</p>";
    }
  }

  // 2. Pintamos los cursos en pantalla
  function mostrarCursos(cursos) {
    // limpiamos para no duplicar si llamas de nuevo a la función
    root.innerHTML = "";

    if (!Array.isArray(cursos) || cursos.length === 0) {
      root.innerHTML = "<p>No hay cursos disponibles.</p>";
      return;
    }

    const gridContainer = document.createElement("div");
    gridContainer.className = "container-fluid p-0";

    const titulo = document.createElement("h1");
    titulo.className = "h3 mb-3";
    titulo.textContent = "Cursos disponibles";

    const row = document.createElement("div");
    row.className = "row";

    cursos.forEach((curso) => {
      const col = document.createElement("div");
      col.className = "col-md-4 mb-3";

      // 👉 Si tu backend no manda link ni img, usamos genéricos
      const enlace = curso.link || `curso.html?id=${curso.id}`;
      const imagen = curso.img || "https://placehold.co/600x400?text=Curso";

      col.innerHTML = `
        <a href="${enlace}" class="text-decoration-none text-dark">
          <div class="card border">
            <img src="${imagen}" class="card-img-top"
                 alt="Imagen de ${curso.titulo}"
                 style="max-height:200px; object-fit:cover;">
            <div class="card-body">
              <h5 class="card-title">${curso.titulo}</h5>
              <h6 class="card-subtitle mb-2 text-muted">
                Fecha: ${new Date(curso.fecha).toLocaleDateString()}
              </h6>
              <p class="card-text">${curso.descripcion}</p>
            </div>
          </div>
        </a>
      `;

      row.appendChild(col);
    });

    gridContainer.appendChild(titulo);
    gridContainer.appendChild(row);
    root.appendChild(gridContainer);
  }

  obtenerCursos();
});
