import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext"; // Importamos el AuthContext
import Layout from "./components/Layout";
import Login from "./components/Login";
import Register from "./components/Register";
import Problems from "./components/Problems";
import Discussion from "./components/Discussion";
import ExerciseDetail from "./components/ExerciseDetail";
import ExerciseList from "./components/ExerciseList";

function App() {
  const { isAuthenticated } = useContext(AuthContext); // Usamos el contexto para obtener el estado de autenticación

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            // Si el usuario está autenticado, redirige a /problems, de lo contrario a /register
            <Navigate to={isAuthenticated ? "/problems" : "/login"} />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas que ahora estarán disponibles sin restricciones */}
        <Route
          path="/problems"
          element={
            <Layout>
              <Problems />
            </Layout>
          }
        />
        <Route
          path="/discussion"
          element={
            <Layout>
              <Discussion />
            </Layout>
          }
        />
        <Route
          path="/exercises/:topicId"
          element={
            <Layout>
              <ExerciseList />
            </Layout>
          }
        />
        <Route
          path="/exercise/:exerciseId"
          element={
            <Layout>
              <ExerciseDetail />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default function AppWithProvider() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
