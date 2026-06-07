import { useEffect, useState } from "react";
import { TextField, Button, IconButton, InputAdornment, MenuItem } from "@mui/material";
import { Edit, Delete, Email, Person, Lock } from "@mui/icons-material";
import Navbar from "../components/Navbar";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    correo: "",
    password: "",
    rol: "",
  });

  // Cargar usuarios desde el backend
  useEffect(() => {
    fetch("http://localhost:3000/api/usuarios")
      .then((res) => res.json())
      .then((data) => setUsuarios(data))
      .catch((err) => console.error("Error al cargar usuarios:", err));
  }, []);

  // Registrar nuevo usuario
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await fetch("http://localhost:3000/api/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoUsuario),
    });

    const res = await fetch("http://localhost:3000/api/usuarios");
    const data = await res.json();

    setUsuarios(Array.isArray(data) ? data : []);

    setNuevoUsuario({
      nombre: "",
      correo: "",
      password: "",
      rol: "",
    });

  } catch (error) {
    console.error("Error al registrar usuario:", error);
  }
};

  // Eliminar usuario
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/usuarios/${id}`, { method: "DELETE" });
      setUsuarios(usuarios.filter((u) => u._id !== id));
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  return (
    <div style={{ backgroundColor: "#eaeaea", minHeight: "100vh" }}>
      {/* Navbar */}
      <nav
        style={{
          backgroundColor: "#40E0D0",
          padding: "15px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "white",
          fontWeight: "bold",
        }}
      >
        <div style={{ display: "flex", gap: "20px" }}>
          <span>Inicio</span>
          <span style={{ borderBottom: "2px solid white" }}>Usuarios</span>
          <span>Vehículos</span>
        </div>
        <div>👤 Admin</div>
      </nav>

      {/* Contenedor principal */}
      <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "20px" }}>
        {/* Formulario de registro */}
        <div
          style={{
            background: "white",
            borderRadius: "10px",
            padding: "20px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            marginBottom: "30px",
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>Registrar Usuario</h2>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
          >
            <TextField
              label="Nombre"
              value={nuevoUsuario.nombre}
              onChange={(e) =>
                setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Correo"
              type="email"
              value={nuevoUsuario.correo}
              onChange={(e) =>
                setNuevoUsuario({ ...nuevoUsuario, correo: e.target.value })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="password"
              type="password"
              value={nuevoUsuario.password}
              onChange={(e) =>
                setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              select
              label="Rol"
              value={nuevoUsuario.rol}
              onChange={(e) =>
                setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })
              }
              style={{ minWidth: "150px" }}
            >
              <MenuItem value="">Seleccionar Rol</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Usuario">Usuario</MenuItem>
            </TextField>

            <Button
              type="submit"
              variant="contained"
              style={{
                backgroundColor: "#40E0D0",
                color: "white",
                fontWeight: "bold",
              }}
            >
              Registrar Usuario
            </Button>
          </form>
        </div>

        {/* Tabla de usuarios */}
        <div
          style={{
            background: "white",
            borderRadius: "10px",
            padding: "20px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>Lista de Usuarios</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f0f0f0" }}>
                <th style={{ padding: "10px" }}>ID</th>
                <th style={{ padding: "10px" }}>Nombre</th>
                <th style={{ padding: "10px" }}>Correo</th>
                <th style={{ padding: "10px" }}>Rol</th>
                <th style={{ padding: "10px" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u, index) => (
                <tr
                  key={u._id}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#fafafa" : "#ffffff",
                  }}
                >
                  <td style={{ padding: "10px" }}>{index + 1}</td>
                  <td style={{ padding: "10px" }}>{u.nombre}</td>
                  <td style={{ padding: "10px" }}>{u.correo}</td>
                  <td style={{ padding: "10px" }}>{u.rol}</td>
                  <td style={{ padding: "10px" }}>
                    <IconButton
                      style={{ color: "#40E0D0" }}
                      onClick={() => alert("Editar usuario")}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      style={{ color: "red" }}
                      onClick={() => handleDelete(u._id)}
                    >
                      <Delete />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}





