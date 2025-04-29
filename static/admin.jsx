import React from "react";
import ReactDOM from "react-dom/client";
import CursoGrid from "./componentes/CursoGrid.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/app.css";

console.log("Hola desde React"); // 👉 1) mensaje a consola

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // 👉 2) UN solo argumento: el árbol React
  <React.StrictMode>
    <CursoGrid />
  </React.StrictMode>
);
