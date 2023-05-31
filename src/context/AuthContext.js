import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase";

// Crear el contexto de autenticación
const authContext = createContext();

// Hook personalizado para acceder al contexto de autenticación
export const useAuth = () => {
  const context = useContext(authContext);
  if (!context) throw new Error("There is no Auth provider");
  return context;
};

// Componente proveedor de autenticación
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función de registro de usuario
  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Función de inicio de sesión
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Función de cierre de sesión
  const logout = () => signOut(auth);

  // Función de restablecimiento de contraseña
  const resetPassword = async (email) => sendPasswordResetEmail(auth, email);

  useEffect(() => {
    // Suscribirse a los cambios de estado de autenticación del usuario
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log({ currentUser });
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const getTMDBToken = () => {
    // Aquí puedes agregar el código para obtener el token de acceso a la API de TMDB
    // Por ejemplo:
    const tmdbToken = "4f5f43495afcc67e9553f6c684a82f84";
    return tmdbToken;
  };

  return (
    <authContext.Provider
      value={{
        signup,
        login,
        user,
        logout,
        loading,
        resetPassword,
        getTMDBToken,
      }}
    >
      {children}
    </authContext.Provider>
  );
}
