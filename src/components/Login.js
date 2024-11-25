import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../utils/api";
import { AuthContext } from "../context/AuthContext"; // Importamos el contexto

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Usamos el método login del contexto

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Inicia el proceso de carga

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/Login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Hubo un problema al iniciar sesión.");
      } else {
        login(data.token); // Usamos el método login del contexto
        navigate("/problems"); // Redirige al dashboard
      }
    } catch (error) {
      setErrorMessage(
        "Hubo un problema al intentar iniciar sesión. Por favor, intenta nuevamente."
      );
    } finally {
      setIsLoading(false); // Detiene el proceso de carga
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <h2>Iniciar Sesión</h2>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          Login
        </button>
        {isLoading && <p>Cargando...</p>}
        {errorMessage && <p className="error">{errorMessage}</p>}
        <p>
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
