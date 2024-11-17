const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "http://localhost:5000"
    : "https://servidor-proyecto.onrender.com";

export default API_BASE_URL;
