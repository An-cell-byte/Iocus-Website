import React from "react";
import ReactDOM from "react-dom/client";
import CursoGrid from "./componentes/CursoGrid.jsx"; // el componente que haremos enseguida
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/app.css"; // si ya tienes tu propio css

ReactDOM.createRoot(document.getElementById("root")).render(
  console.log("Hola desde React"),
  <React.StrictMode>
    <CursoGrid />
  </React.StrictMode>
);
