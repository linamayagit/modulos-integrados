import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const estiloBoton = {
    background: "#3EB489",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    margin: "0 5px",
  };

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
      <button style={estiloBoton} onClick={() => navigate("/usuarios")}>
        Usuarios
      </button>

      <button style={estiloBoton} onClick={() => navigate("/vehiculos")}>
        Vehículos
      </button>

      <button style={estiloBoton} onClick={() => navigate("/")}>
        Cerrar Sesión
      </button>
    </nav>
  );
}

export default Navbar;


