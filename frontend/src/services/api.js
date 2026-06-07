import axios from "axios";

// Configuración de la API
const api = axios.create({
  baseURL: "http://localhost:3000/api", // tu backend corre en el puerto 3000
});

export default api;
