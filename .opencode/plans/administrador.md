# Plan — Unificar Administrador con Usuarios

## 1. Backend — `controllers/usuariocontroller.js`

Agregar ANTES de `loginUsuario`:

```js
const actualizarUsuario = async (req, res) => {
  try {
    const { nombre, correo, rol, password } = req.body;
    const update = {};
    if (nombre) update.nombre = nombre;
    if (correo) update.correo = correo;
    if (rol) update.rol = rol;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      update.password = await bcrypt.hash(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id, update,
      { new: true, select: "-password" }
    );
    if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });

    res.json({ mensaje: "Usuario actualizado", usuario });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar usuario", error });
  }
};

const eliminarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });
    res.json({ mensaje: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar usuario", error });
  }
};
```

Y en `module.exports` agregar:
```js
  actualizarUsuario,
  eliminarUsuario,
```

## 2. Backend — `routes/usuarioroutes.js`

Agregar antes de `module.exports`:
```js
router.put("/:id", authMiddleware, actualizarUsuario);
router.delete("/:id", authMiddleware, eliminarUsuario);
```

E importar en el require:
```js
const {
  crearUsuario,
  listarUsuarios,
  loginUsuario,
  actualizarUsuario,
  eliminarUsuario
} = require("../controllers/usuarioController");
```

## 3. Frontend — `pages/Usuarios.jsx`

Reemplazar TODO el archivo con:

```jsx
import { useEffect, useState } from "react";
import {
  TextField, Button, IconButton, InputAdornment,
  MenuItem, Snackbar, Alert, Card, CardContent,
  CircularProgress
} from "@mui/material";
import { Edit, Delete, Email, Person, Lock, AdminPanelSettings, PersonOutline, Search } from "@mui/icons-material";
import api from "../services/api";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState(null);
  const [page, setPage] = useState(1);
  const [soloAdmins, setSoloAdmins] = useState(false);
  const [form, setForm] = useState({ nombre: "", correo: "", password: "", rol: "usuario" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  const cargarUsuarios = async () => {
    try {
      const params = `?page=${page}&limit=20${soloAdmins ? "&rol=admin" : ""}`;
      const res = await api.get(`/usuarios${params}`);
      setUsuarios(res.data);
    } catch {
      setSnackbar({ open: true, message: "Error al cargar usuarios", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, [page, soloAdmins]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.correo) {
      setSnackbar({ open: true, message: "Nombre y correo son obligatorios", severity: "error" });
      return;
    }

    try {
      if (editId) {
        const payload = { nombre: form.nombre, correo: form.correo, rol: form.rol };
        if (form.password) payload.password = form.password;
        await api.put(`/usuarios/${editId}`, payload);
        setSnackbar({ open: true, message: "Usuario actualizado", severity: "success" });
        setEditId(null);
      } else {
        if (!form.password) {
          setSnackbar({ open: true, message: "Contraseña es obligatoria al crear", severity: "error" });
          return;
        }
        await api.post("/usuarios", form);
        setSnackbar({ open: true, message: "Usuario creado", severity: "success" });
      }

      setForm({ nombre: "", correo: "", password: "", rol: "usuario" });
      await cargarUsuarios();
    } catch (err) {
      const mensaje = err.response?.data?.mensaje || "Error guardando usuario";
      setSnackbar({ open: true, message: mensaje, severity: "error" });
    }
  };

  const handleEdit = (u) => {
    setForm({ nombre: u.nombre, correo: u.correo, password: "", rol: u.rol });
    setEditId(u._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    try {
      await api.delete(`/usuarios/${id}`);
      setSnackbar({ open: true, message: "Usuario eliminado", severity: "success" });
      await cargarUsuarios();
    } catch {
      setSnackbar({ open: true, message: "Error al eliminar usuario", severity: "error" });
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "60px" }}>
        <CircularProgress />
      </div>
    );
  }

  const docs = usuarios?.docs ?? [];
  const totalPages = usuarios?.totalPages ?? 1;

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      <h1 style={{ margin: "0 0 24px 0", color: "#333" }}>Usuarios</h1>

      <Card style={{ marginBottom: "24px" }}>
        <CardContent>
          <h3 style={{ margin: "0 0 16px 0", color: "#333" }}>
            {editId ? "Editar usuario" : "Registrar nuevo usuario"}
          </h3>
          <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "flex-end" }}>
            <TextField
              label="Nombre"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              InputProps={{ startAdornment: <InputAdornment position="start"><Person /></InputAdornment> }}
              style={{ minWidth: "180px", flex: 1 }}
            />
            <TextField
              label="Correo"
              type="email"
              value={form.correo}
              onChange={(e) => setForm({ ...form, correo: e.target.value })}
              InputProps={{ startAdornment: <InputAdornment position="start"><Email /></InputAdornment> }}
              style={{ minWidth: "220px", flex: 1 }}
            />
            <TextField
              label={editId ? "Nueva contraseña (opcional)" : "Contraseña"}
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              InputProps={{ startAdornment: <InputAdornment position="start"><Lock /></InputAdornment> }}
              style={{ minWidth: "180px", flex: 1 }}
            />
            <TextField
              select
              label="Rol"
              value={form.rol}
              onChange={(e) => setForm({ ...form, rol: e.target.value })}
              style={{ minWidth: "140px" }}
            >
              <MenuItem value="usuario">Usuario</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>

            <Button
              type="submit"
              variant="contained"
              startIcon={editId ? <Edit /> : <Person />}
              sx={{ height: "56px" }}
            >
              {editId ? "Actualizar" : "Registrar"}
            </Button>

            {editId && (
              <Button
                variant="outlined"
                onClick={() => {
                  setEditId(null);
                  setForm({ nombre: "", correo: "", password: "", rol: "usuario" });
                }}
                sx={{ height: "56px" }}
              >
                Cancelar
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ margin: 0, color: "#333" }}>
              {soloAdmins ? "Administradores" : "Todos los usuarios"}
            </h3>
            <Button
              size="small"
              variant={soloAdmins ? "contained" : "outlined"}
              onClick={() => setSoloAdmins(!soloAdmins)}
              startIcon={<Search />}
            >
              {soloAdmins ? "Ver todos" : "Solo admins"}
            </Button>
          </div>

          {docs.length === 0 ? (
            <p style={{ color: "#999" }}>No hay usuarios</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #eee" }}>
                    <th style={{ textAlign: "left", padding: "10px", color: "#666" }}>Nombre</th>
                    <th style={{ textAlign: "left", padding: "10px", color: "#666" }}>Correo</th>
                    <th style={{ textAlign: "center", padding: "10px", color: "#666" }}>Rol</th>
                    <th style={{ textAlign: "center", padding: "10px", color: "#666" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {docs.map((u) => (
                    <tr key={u._id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td style={{ padding: "12px 10px", fontWeight: "bold" }}>{u.nombre}</td>
                      <td style={{ padding: "12px 10px", color: "#555" }}>{u.correo}</td>
                      <td style={{ padding: "12px 10px", textAlign: "center" }}>
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: "4px",
                          padding: "2px 10px", borderRadius: "12px", fontSize: "12px",
                          fontWeight: "bold",
                          background: u.rol === "admin" ? "#cce5ff" : "#e2e3e5",
                          color: u.rol === "admin" ? "#004085" : "#383d41",
                        }}>
                          {u.rol === "admin" ? <AdminPanelSettings fontSize="small" /> : <PersonOutline fontSize="small" />}
                          {u.rol === "admin" ? "Admin" : "Usuario"}
                        </span>
                      </td>
                      <td style={{ padding: "12px 10px", textAlign: "center" }}>
                        <IconButton onClick={() => handleEdit(u)} color="primary"><Edit /></IconButton>
                        <IconButton onClick={() => handleDelete(u._id)} color="error"><Delete /></IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "16px" }}>
              <Button disabled={page <= 1} onClick={() => setPage(page - 1)} variant="outlined" size="small">Anterior</Button>
              <span style={{ display: "flex", alignItems: "center", padding: "0 12px", color: "#666" }}>
                Pág {usuarios?.page ?? page} de {totalPages}
              </span>
              <Button disabled={page >= totalPages} onClick={() => setPage(page + 1)} variant="outlined" size="small">Siguiente</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
```

## Resumen de cambios

| Archivo | Cambio |
|---|---|
| `backend/src/controllers/usuariocontroller.js` | + `actualizarUsuario` (PUT), + `eliminarUsuario` (DELETE) |
| `backend/src/routes/usuarioroutes.js` | Rutas `PUT /:id` y `DELETE /:id` con auth |
| `frontend/src/pages/Usuarios.jsx` | Reemplazo completo: edición funcional, filtro "Solo admins", paginación, chips de rol, compatible con MUI v9 |
```
