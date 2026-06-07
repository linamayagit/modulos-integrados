import { useEffect, useState } from "react";
import { TextField, Button, IconButton, InputAdornment, MenuItem } from "@mui/material";
import { Edit, Delete, Email, Person, Lock } from "@mui/icons-material";
import Card from "../components/Card";
import api from "../services/api";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    correo: "",
    password: "",
    rol: "",
  });

  useEffect(() => {
    api.get("/usuarios")
      .then((res) => setUsuarios(res.data))
      .catch((err) => console.error("Error al cargar usuarios:", err));
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await api.post("/usuarios", nuevoUsuario);

    const res = await api.get("/usuarios");
    setUsuarios(Array.isArray(res.data) ? res.data : []);

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

  const handleDelete = async (id) => {
    try {
      await api.delete(`/usuarios/${id}`);
      setUsuarios(usuarios.filter((u) => u._id !== id));
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  return (
    <div style={{ backgroundColor: "#eaeaea", minHeight: "100vh" }}>
      {/* Contenedor principal */}
      <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "20px" }}>
        <Card title="Registrar Usuario" style={{ marginBottom: "30px" }}>
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
        </Card>

        <Card title="Lista de Usuarios">
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
        </Card>
      </div>
    </div>
  );
}



