import React, { useEffect, useState } from "react";
import CursoCard from "./CursoCard.jsx";

export default function CursoGrid() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("backendlink.io") // mismo dominio => sin CORS extra
      .then((r) => r.json())
      .then((data) => {
        setCursos(data);
        setLoading(false);
      })
      .catch((e) => console.error(e));
  }, []);

  if (loading) return <p>Cargando…</p>;

  return (
    <div className="container-fluid p-0">
      <h1 className="h3 mb-3">Cursos inscritos</h1>
      <div className="row">
        {cursos.map((c) => (
          <CursoCard key={c.id} {...c} />
        ))}
      </div>
    </div>
  );
}
