import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import "./ExerciseDetail.css";
import API_BASE_URL from "../utils/api";

const ExerciseDetail = () => {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userCode, setUserCode] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    fetchExerciseDetail();
  }, [exerciseId]);

  const fetchExerciseDetail = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/problems/details/${exerciseId}`,
        {
          headers: { "auth-token": localStorage.getItem("auth-token") },
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener el detalle del ejercicio.");
      }

      const data = await response.json();
      setExercise(data.exercise);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const cleanedCode = userCode.replace(/\s+/g, " ").trim(); // Normaliza el código del usuario
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/validate/validate-answer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("auth-token"),
          },
          body: JSON.stringify({
            code: exercise.code,
            userCode: cleanedCode,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al validar la respuesta.");
      }

      const data = await response.json();
      setFeedback(data.validation.feedback);
      setIsCorrect(data.validation.isCorrect);
    } catch (err) {
      setFeedback("Hubo un error al validar tu código. Inténtalo nuevamente.");
    }
  };

  const handleBackToList = () => {
    navigate(`/exercises/${exercise.topic}`);
  };

  return (
    <div className="exercise-detail-container">
      {loading && <p className="loading">Cargando detalles del ejercicio...</p>}
      {error && <p className="error">{error}</p>}
      {exercise && (
        <div className="exercise-card">
          <div className="exercise-header">
            <h2>{exercise.title}</h2>
            <span className={`exercise-level ${exercise.level}`}>
              Nivel:{" "}
              {exercise.level.charAt(0).toUpperCase() + exercise.level.slice(1)}
            </span>
            <span className="exercise-language">Lenguaje: JavaScript</span>
          </div>
          <div className="exercise-details">
            <p className="exercise-description">{exercise.description}</p>
            <div className="example-section">
              <h3>Ejemplo de Entrada:</h3>
              <pre>{exercise.exampleInput}</pre>
            </div>
            <div className="example-section">
              <h3>Ejemplo de Salida:</h3>
              <pre>{exercise.exampleOutput}</pre>
            </div>
          </div>
          <div className="code-editor">
            <h3>Escribe tu solución:</h3>
            <CodeMirror
              value={userCode}
              height="200px"
              extensions={[javascript()]}
              onChange={(value) => setUserCode(value)}
              editable={!isCorrect} // Bloquear si ya está resuelto
            />
            {!isCorrect && (
              <button onClick={handleSubmit} className="submit-button">
                Enviar Solución
              </button>
            )}
          </div>
          {feedback && (
            <div className={`feedback-box ${isCorrect ? "success" : "error"}`}>
              <p>{feedback}</p>
            </div>
          )}
          <div className="button-group">
            <button onClick={handleBackToList} className="back-button">
              Regresar al Listado
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseDetail;
