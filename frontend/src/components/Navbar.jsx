import { NavLink } from "react-router-dom";

function Navbar() {
  const estiloNav = {
    background: "#40E0D0",
    padding: "15px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "white",
    fontWeight: "bold",
  };

  const estiloLink = {
    color: "white",
    textDecoration: "none",
    fontWeight: "bold",
    paddingBottom: "5px",
  };

  return (
    <nav style={estiloNav}>
      <div style={{ display: "flex", gap: "20px" }}>
        <NavLink
          to="/usuarios"
          style={({ isActive }) => ({
            ...estiloLink,
            borderBottom: isActive ? "2px solid white" : "none",
          })}
        >
          Usuarios
        </NavLink>

        <NavLink
          to="/vehiculos"
          style={({ isActive }) => ({
            ...estiloLink,
            borderBottom: isActive ? "2px solid white" : "none",
          })}
        >
          Vehículos
        </NavLink>
      </div>

      <div>👤 Admin</div>
    </nav>
  );
}

export default Navbar;