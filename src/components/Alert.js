import "./login.css"; // Importa el archivo CSS de estilo personalizado

export function Alert({ message }) {
  return (
    <div className="alert-container">
      <div className="alert-content">
        <span>{message}</span>
      </div>
    </div>
  );
}
