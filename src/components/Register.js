import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Alert } from "./Alert";

import "./register.css";

export function Register() {
  // Importar los hooks y componentes necesarios
  const { signup } = useAuth(); // Contexto de autenticación

  // Estado para los datos del usuario (email y contraseña)
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(""); // Estado para el mensaje de error
  const navigate = useNavigate(); // Navegación

  const [backgroundColor, setBackgroundColor] = useState("#2e0031"); // Estado para el color de fondo

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signup(user.email, user.password); // Intentar registrarse con los datos del usuario
      navigate("/"); // Redirigir a la página principal después del registro exitoso
    } catch (error) {
      setError(error.message); // Capturar y mostrar cualquier error ocurrido durante el registro
    }
  };

  return (
    <div className="register-container" style={{ backgroundColor }}>
      {error && <Alert message={error} />} {/* Mostrar el mensaje de error si existe */}

      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label htmlFor="email" className="text-register">
            CORREO ELECTRONICO
          </label>
          <input
            type="email"
            onChange={(e) => setUser({ ...user, email: e.target.value })} /* Actualizar el estado del email */
            placeholder="TU CORREO"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="text-register">
            CONTRASEÑA
          </label>
          <input
            type="password"
            onChange={(e) => setUser({ ...user, password: e.target.value })} /* Actualizar el estado de la contraseña */
            placeholder="TU CONTRASEÑA"
          />
        </div>

        <button type="submit" className="submit-button">
          REGISTRARTE
        </button>
      </form>

      <div className="color-picker">
        <span>Selecciona un color de fondo:</span>
        <input
          type="color"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)} /* Actualizar el estado del color de fondo */
        />
      </div>
    </div>
  );
}
