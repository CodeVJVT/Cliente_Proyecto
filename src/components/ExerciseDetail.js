import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror"; // Importa el componente predeterminado
import { javascript } from "@codemirror/lang-javascript";
import "./ExerciseDetail.css";

const ExerciseDetail = () => {
  const { exerciseId } = useParams();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userCode, setUserCode] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const fetchExerciseDetail = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/problems/details/${exerciseId}`,
          {
            headers: {
              "auth-token": localStorage.getItem("auth-token"),
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener el detalle del ejercicio.");
        }

        const data = await response.json();
        setExercise(data.exercise);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExerciseDetail();
  }, [exerciseId]);

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/validate/validate-answer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("auth-token"),
          },
          body: JSON.stringify({
            code: exercise.code, // Debe coincidir con el campo en el backend
            userCode, // Código del usuario
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al validar la respuesta.");
      }

      const data = await response.json();
      setFeedback(data.validation.feedback);
    } catch (error) {
      setFeedback("Hubo un error al validar tu código. Inténtalo nuevamente.");
    }
  };

  return (
    <div className="exercise-detail-container">
      {loading && <p className="loading">Cargando detalles del ejercicio...</p>}
      {error && <p className="error">{error}</p>}
      {exercise && (
        <>
          <div className="exercise-header">
            <h2>{exercise.title}</h2>
            <p className="exercise-level">Nivel: {exercise.level}</p>
          </div>
          <div className="exercise-description">
            <p>{exercise.description}</p>
          </div>
          <div className="exercise-example">
            <h3>Ejemplo de Entrada:</h3>
            <pre>{exercise.exampleInput}</pre>
          </div>
          <div className="exercise-example">
            <h3>Ejemplo de Salida:</h3>
            <pre>{exercise.exampleOutput}</pre>
          </div>
          <div className="code-editor">
            <h3>Escribe tu solución:</h3>
            <CodeMirror
              value={userCode}
              height="200px"
              extensions={[javascript()]}
              onChange={(value) => setUserCode(value)}
            />
            <button onClick={handleSubmit} className="submit-button">
              Enviar Solución
            </button>
          </div>
          {feedback && (
            <div
              className={`feedback-box ${
                feedback.isCorrect ? "success" : "error"
              }`}
            >
              <p>{feedback}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExerciseDetail;
