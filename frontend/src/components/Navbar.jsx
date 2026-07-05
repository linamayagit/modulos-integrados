import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const obtenerRol = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try { return JSON.parse(atob(token.split(".")[1])).rol; } catch { return null; }
  };

  const rol = obtenerRol();

  const esActivo = (path) => location.pathname === path;

  const estiloBoton = (path) => ({
    background: esActivo(path) ? "#2a8f6a" : "#3EB489",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    margin: "0 5px",
    transition: "background 0.2s",
  });

  const estiloNav = {
    background: "#666",
    padding: "15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
  };

  return (
    <nav style={estiloNav}>
      <button style={estiloBoton("/home")} onClick={() => navigate("/home")}>
        Inicio
      </button>

      <button style={estiloBoton("/registros")} onClick={() => navigate("/registros")}>
        Registros
      </button>

      <button style={estiloBoton("/vehiculos")} onClick={() => navigate("/vehiculos")}>
        Vehículos
      </button>

      <button style={estiloBoton("/parqueaderos")} onClick={() => navigate("/parqueaderos")}>
        Parqueaderos
      </button>

      <button style={estiloBoton("/tickets")} onClick={() => navigate("/tickets")}>
        Tickets
      </button>

      {rol === "admin" && (
        <button style={estiloBoton("/tarifas")} onClick={() => navigate("/tarifas")}>
          Tarifas
        </button>
      )}

      {rol === "admin" && (
        <button style={estiloBoton("/contabilidad")} onClick={() => navigate("/contabilidad")}>
          Contabilidad
        </button>
      )}

      {rol === "admin" && (
        <button style={estiloBoton("/usuarios")} onClick={() => navigate("/usuarios")}>
          Usuarios
        </button>
      )}

      <button
        style={{ ...estiloBoton(""), background: "#c0392b" }}
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("rol");
          navigate("/");
        }}
      >
        Cerrar Sesión
      </button>
    </nav>
  );
}

export default Navbar;


