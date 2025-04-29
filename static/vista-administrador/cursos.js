document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("root");

  async function obtenerCursos() {
    try {
      const respuesta = await fetch("backendlink.io");
      const cursos = await respuesta.json();

      mostrarCursos(cursos);
    } catch (error) {
      console.error("Error al cargar los cursos:", error);
      root.innerHTML = "<p>Error al cargar los cursos.</p>";
    }
  }

  function mostrarCursos(cursos) {
    if (cursos.length === 0) {
      root.innerHTML = "<p>No hay cursos disponibles.</p>";
      return;
    }

    const gridContainer = document.createElement("div");
    gridContainer.className = "container-fluid p-0";

    const titulo = document.createElement("h1");
    titulo.className = "h3 mb-3";
    titulo.textContent = "Cursos inscritos";

    const row = document.createElement("div");
    row.className = "row";

    cursos.forEach((curso) => {
      const col = document.createElement("div");
      col.className = "col-md-4 mb-3";

      col.innerHTML = `
        <a href="${curso.link}" class="text-decoration-none text-dark">
          <div class="card border">
            <img src="${curso.img}" class="card-img-top" alt="Imagen de ${curso.titulo}" style="max-height:200px; object-fit:cover;">
            <div class="card-body">
              <h5 class="card-title">${curso.titulo}</h5>
              <h6 class="card-subtitle mb-2 text-muted">Código: ${curso.codigo}</h6>
              <p class="card-text">${curso.texto}</p>
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
