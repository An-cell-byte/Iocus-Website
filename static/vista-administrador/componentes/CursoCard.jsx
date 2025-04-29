export default function CursoCard({ img, titulo, codigo, texto, link }) {
  return (
    <div className="col-md-4 mb-3">
      <a href={link} className="text-decoration-none text-dark">
        <div className="card border">
          <img
            src={img}
            className="card-img-top"
            alt={`Imagen de ${titulo}`}
            style={{ maxHeight: 200, objectFit: "cover" }}
          />
          <div className="card-body">
            <h5 className="card-title">{titulo}</h5>
            <h6 className="card-subtitle mb-2 text-muted">Código: {codigo}</h6>
            <p className="card-text">{texto}</p>
          </div>
        </div>
      </a>
    </div>
  );
}
