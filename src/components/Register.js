import React, { useState } from "react";
import API_BASE_URL from "../utils/api";
import { Link } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false); // Estado para la carga

  const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true); // Activar el estado de carga

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.status === 400) {
        setErrorMessage(data.message);
      } else if (response.status === 201) {
        setSuccessMessage(data.message);
        setUsername("");
        setPassword("");
      } else {
        setErrorMessage("Algo salió mal");
      }
    } catch (error) {
      setErrorMessage(
        "Hubo un problema al intentar registrarte. Por favor, intenta nuevamente."
      );
    } finally {
      setLoading(false); // Desactivar el estado de carga
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleRegister}>
        <h2>Registro</h2>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="message-container">
          {errorMessage && <p className="error">{errorMessage}</p>}
          {successMessage && <p className="success">{successMessage}</p>}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Cargando..." : "Registrarse"}
        </button>
        <p>
          ¿Ya tienes una cuenta? <Link to="/login">Iniciar sesión</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
