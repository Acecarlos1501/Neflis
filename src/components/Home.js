import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "./home.css"; // Importa el archivo CSS de estilo personalizado

export function Home() {
  const { logout, user } = useAuth();

  console.log(user);
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <p className="home-title">BIENVENIDO {user.displayName || user.email}</p>
        <Link to="/principal" className="home-button">
          IR A NEFLIS
        </Link>
      </div>
    </div>
  );
}
