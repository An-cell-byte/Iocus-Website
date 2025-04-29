function protegerAlumno() {
  const token = localStorage.getItem("token"); // 1️⃣
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");

  // --- No hay sesión válida → fuera
  if (!token || !usuario) {
    window.location.href = "/index.html";
    return;
  }

  // --- Tiene sesión pero es otro rol (ej. 'capacitador') → lo rediriges
  if (usuario.rol !== "alumno") {
    // 2️⃣
    window.location.href = "/vista-administrador/vistaAdministrador.html";
    return;
  }

  // --- Es alumno → todo ok, la página sigue cargando 😎
}

// Lánzalo apenas se termine de cargar el DOM
document.addEventListener("DOMContentLoaded", protegerAlumno);
