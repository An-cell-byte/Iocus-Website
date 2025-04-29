function protegerCapacitador() {
  const token = localStorage.getItem("token"); // 1️⃣
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null"); // 2️⃣

  // --- Sin sesión válida → login
  if (!token || !usuario) {
    window.location.href = "/index.html";
    return;
  }

  // --- Con sesión pero rol incorrecto → a su área de alumno
  if (usuario.rol !== "capacitador") {
    // 3️⃣
    window.location.href = "/vista-estudiante/coursescreen.html";
    return;
  }

  // Si llegó aquí: es capacitador, todo OK 😎
}

// Llama a la función en cuanto cargue la página protegida
document.addEventListener("DOMContentLoaded", protegerCapacitador);
