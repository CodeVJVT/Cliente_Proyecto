import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ExerciseList.css";
import API_BASE_URL from "../utils/api";

const ExerciseList = () => {
  const { topicId } = useParams();
  const [exercises, setExercises] = useState([]);
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingListings, setLoadingListings] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
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
          throw new Error("Error al obtener los datos.");
        }

        const data = await response.json();
        setExercises(data.exercises || []);
        setListings(data.listings || null);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [topicId]);

  const handleCreateExercise = async (exerciseText, level, index, category) => {
    try {
      await fetch(`${API_BASE_URL}/api/problems/mark-selected`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
        body: JSON.stringify({ topic: topicId, category, index }),
      });

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
            level,
            exerciseText,
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
      navigate(`/exercise/${data.problem.code}`);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchListings = async () => {
    setLoadingListings(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/problems/generate-listing`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("auth-token"),
          },
          body: JSON.stringify({ topic: topicId }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al generar el listado de ejercicios.");
      }

      const data = await response.json();
      setListings(data.listings);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingListings(false);
    }
  };

  const renderLevel = (level) => {
    switch (level?.toLowerCase()) {
      case "facil":
      case "basico":
        return "Básico";
      case "medio":
      case "intermedio":
        return "Intermedio";
      case "dificil":
      case "avanzado":
        return "Avanzado";
      default:
        console.warn(`Nivel desconocido: ${level}`);
        return "Nivel Desconocido";
    }
  };

  return (
    <div className="exercise-list-container">
      <h2>Ejercicios de {topicId}</h2>

      {/* Mostrar estado de carga */}
      {loading && <p className="loading">Cargando datos...</p>}

      {/* Mostrar errores */}
      {error && <p className="error">{error}</p>}

      {/* Contenido principal */}
      {!loading && !error && (
        <>
          {/* Ejercicios ya creados */}
          {exercises.length > 0 && (
            <div className="exercise-list">
              {exercises.map((exercise) => (
                <div
                  key={exercise.code}
                  className="exercise-card"
                  onClick={() => navigate(`/exercise/${exercise.code}`)}
                >
                  <h3 className="exercise-title">{exercise.title}</h3>
                  <p className="exercise-description">{exercise.description}</p>
                  <div
                    className={`exercise-level ${
                      exercise.level === "facil"
                        ? "basic"
                        : exercise.level === "medio"
                        ? "intermediate"
                        : "advanced"
                    }`}
                  >
                    Nivel: {renderLevel(exercise.level)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Listado de preguntas interactivas */}
          {listings && (
            <div className="listings-container">
              {["basico", "intermedio", "avanzado"].map((level) => (
                <div key={level} className="listing-category">
                  <h3>{level.charAt(0).toUpperCase() + level.slice(1)}</h3>
                  {listings[level]?.map((exercise, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        if (!exercise.selected) {
                          handleCreateExercise(
                            exercise.text,
                            level,
                            index,
                            level
                          );
                        }
                      }}
                      className={`listing-item ${
                        exercise.selected ? "disabled" : ""
                      }`}
                      aria-label={`Ejercicio ${level}`}
                      title={
                        exercise.selected
                          ? "Este enunciado ya fue utilizado para generar un ejercicio."
                          : "Haz clic para generar un ejercicio."
                      }
                    >
                      {exercise.text}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Botones de navegación */}
      <div className="button-group">
        <button onClick={() => navigate("/problems")} className="menu-button">
          Volver al Menú
        </button>
        <button
          onClick={fetchListings}
          className="regenerate-button"
          disabled={loadingListings}
        >
          {loadingListings ? "Cargando..." : "Regenerar Listado"}
        </button>
      </div>
    </div>
  );
};

export default ExerciseList;
