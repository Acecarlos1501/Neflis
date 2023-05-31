import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Alert } from "./Alert";

import "./login.css"; // Importa el archivo CSS de estilo personalizado

export function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const { login, resetPassword } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(user.email, user.password);
      navigate("/home"); // Redirige a la página de inicio después de iniciar sesión
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChange = ({ target: { value, name } }) =>
    setUser({ ...user, [name]: value });

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!user.email) return setError("Write an email to reset password");
    try {
      await resetPassword(user.email);
      setError("We sent you an email. Check your inbox");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
      {error && <Alert message={error} />}

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            CORREO ELECTRONICO
          </label>
          <input
            type="email"
            name="email"
            id="email"
            onChange={handleChange}
            className="form-input"
            placeholder="TU CORREO"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            CONTRASEÑA
          </label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={handleChange}
            className="form-input"
            placeholder="TU CONTRASEÑA"
          />
        </div>

        <div className="form-group">
          <button type="submit" className="login-button">
            INGRESAR
          </button>
          <a
            className="forgot-password-link"
            href="#!"
            onClick={handleResetPassword}
          >
            OLVIDASTE TU CONTRASEÑA?
          </a>
        </div>
      </form>
      <p className="register-link">
        <Link to="/register">REGISTRATE</Link>
      </p>
    </div>
  );
}
