/* 1. Función sencilla para leer una cookie */
function getCookie(nombre) {
  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith(nombre + "="))
      ?.split("=")[1] || null
  );
}

/* 2. Bloqueo de rutas solo-capacitador */
(function protegerCapacitador() {
  const tipo = getCookie("tipo"); // puede ser 'capacitador', 'alumno' o null

  // 👉 Si NO hay cookie o el tipo NO es 'capacitador', lo sacamos
  if (tipo !== "capacitador") {
    // idea 1: regresarlo al login
    // location.href = "/pages-sign-in.html";

    // idea 2: si es alumno, reenvíalo a su vista
    if (tipo === "alumno") {
      location.href = "/vista-estudiante/coursescreen.html";
    } else {
      location.href = "/pages-sign-in.html"; // sin sesión válida
    }
  }

  /* 3. Si llega aquí, es capacitador → la página sigue cargando normal */
})();
