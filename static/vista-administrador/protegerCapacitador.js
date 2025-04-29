/* protegerCapacitador.js
   Bloquea el acceso a páginas exclusivas de capacitadores */

/* 1. Función para leer y decodificar una cookie */
function getCookie(nombre) {
  const fila = document.cookie
    .split("; ")
    .find((row) => row.startsWith(nombre + "="));

  // Si existe la cookie → devuelve el valor decodificado; si no, null
  return fila ? decodeURIComponent(fila.split("=")[1]) : null;
}

/* 2. IIFE que protege toda la página */
(function protegerCapacitador() {
  const tipo = getCookie("tipo"); // 'capacitador', 'alumno' o null

  // Si no es capacitador, lo sacamos ⬇
  if (tipo !== "capacitador") {
    if (tipo === "alumno") {
      // Usuario logueado pero sin permisos
      window.location.replace("/vista-estudiante/coursescreen.html");
    } else {
      // Sin sesión o cookie corrupta
      window.location.replace("/pages-sign-in.html");
    }
    return; // detenemos el resto del script
  }

  /* 3. Si llega aquí, SÍ es capacitador → la página puede cargar normal */
})();
