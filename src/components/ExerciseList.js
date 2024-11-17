import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ExerciseList.css";
import API_BASE_URL from "../utils/api";

const ExerciseList = () => {
  const { topicId } = useParams();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/problems/topic/${topicId}`,
          {
            headers: {
              "auth-token": localStorage.getItem("auth-token"),
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener los ejercicios.");
        }

        const data = await response.json();
        setExercises(data.exercises);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [topicId]);

  const handleCreateExercise = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/problems/generate-problem`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("auth-token"),
          },
          body: JSON.stringify({
            topic: topicId,
            level: "facil", // Puedes ajustar el nivel según lo necesites
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Error al generar un nuevo ejercicio."
        );
      }

      const data = await response.json();
      navigate(`/exercise/${data.problem.code}`); // Navega al ejercicio generado
    } catch (error) {
      setError("error.message");
    }
  };

  return (
    <div className="exercise-list-container">
      <h2>Ejercicios de {topicId}</h2>
      {loading && <p>Cargando ejercicios...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <>
          {exercises.length > 0 ? (
            <ul>
              {exercises.map((exercise) => (
                <li
                  key={exercise.code}
                  className="exercise-item"
                  onClick={() => navigate(`/exercise/${exercise.code}`)}
                >
                  <h3>{exercise.title}</h3>
                  <p>{exercise.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div>
              <p>No hay ejercicios disponibles para este tema.</p>
              <button onClick={handleCreateExercise} className="create-button">
                Crear Nuevo Ejercicio
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExerciseList;
