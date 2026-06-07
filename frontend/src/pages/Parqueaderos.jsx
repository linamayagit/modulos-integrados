import { useEffect, useState } from "react";
import { TextField, Button, IconButton, Snackbar, Alert, Card, CardContent } from "@mui/material";
import { Delete, Edit, AddLocation } from "@mui/icons-material";
import api from "../services/api";

export default function Parqueaderos() {
  const [parqueaderos, setParqueaderos] = useState({ docs: [], totalDocs: 0, page: 1, totalPages: 1 });
  const [form, setForm] = useState({ nombre: "", direccion: "", capacidad: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  const cargarDatos = async () => {
    try {
      const res = await api.get(`/parqueaderos/listar?page=${page}&limit=20`);
      setParqueaderos(res.data);
    } catch {
      setSnackbar({ open: true, message: "Error al cargar parqueaderos", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [page]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre || !form.direccion || !form.capacidad) {
      setSnackbar({ open: true, message: "Todos los campos son obligatorios", severity: "error" });
      return;
    }
    if (Number(form.capacidad) < 1) {
      setSnackbar({ open: true, message: "La capacidad debe ser al menos 1", severity: "error" });
      return;
    }

    try {
      if (editId) {
        await api.put(`/parqueaderos/actualizar/${editId}`, {
          nombre: form.nombre,
          direccion: form.direccion,
          capacidad: Number(form.capacidad),
        });
        setSnackbar({ open: true, message: "Parqueadero actualizado", severity: "success" });
        setEditId(null);
      } else {
        await api.post("/parqueaderos/registrar", {
          nombre: form.nombre,
          direccion: form.direccion,
          capacidad: Number(form.capacidad),
        });
        setSnackbar({ open: true, message: "Parqueadero registrado", severity: "success" });
      }

      setForm({ nombre: "", direccion: "", capacidad: "" });
      await cargarDatos();
    } catch (err) {
      const mensaje = err.response?.data?.mensaje || "Error guardando parqueadero";
      setSnackbar({ open: true, message: mensaje, severity: "error" });
    }
  };

  const handleEdit = (p) => {
    setForm({
      nombre: p.nombre,
      direccion: p.direccion,
      capacidad: String(p.capacidad),
    });
    setEditId(p._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este parqueadero?")) return;
    try {
      await api.delete(`/parqueaderos/eliminar/${id}`);
      setSnackbar({ open: true, message: "Parqueadero eliminado", severity: "success" });
      await cargarDatos();
    } catch {
      setSnackbar({ open: true, message: "Error al eliminar parqueadero", severity: "error" });
    }
  };

  const docs = parqueaderos.docs ?? [];

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      <h1 style={{ margin: "0 0 24px 0", color: "#333" }}>Parqueaderos</h1>

      <Card style={{ marginBottom: "24px" }}>
        <CardContent>
          <h3 style={{ margin: "0 0 16px 0", color: "#333" }}>
            {editId ? "Editar parqueadero" : "Registrar nuevo parqueadero"}
          </h3>
          <form onSubmit={handleSubmit} style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "flex-end" }}>
            <TextField
              name="nombre"
              label="Nombre"
              value={form.nombre}
              onChange={handleChange}
              style={{ minWidth: "200px", flex: 1 }}
            />

            <TextField
              name="direccion"
              label="Dirección"
              value={form.direccion}
              onChange={handleChange}
              style={{ minWidth: "250px", flex: 1 }}
            />

            <TextField
              name="capacidad"
              label="Capacidad (puestos)"
              type="number"
              value={form.capacidad}
              onChange={handleChange}
              style={{ minWidth: "160px", flex: 1 }}
              inputProps={{ min: 1 }}
            />

            <Button
              type="submit"
              variant="contained"
              startIcon={editId ? <Edit /> : <AddLocation />}
              sx={{ height: "56px" }}
            >
              {editId ? "Actualizar" : "Registrar"}
            </Button>

            {editId && (
              <Button
                variant="outlined"
                onClick={() => {
                  setEditId(null);
                  setForm({ nombre: "", direccion: "", capacidad: "" });
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
          <h3 style={{ margin: "0 0 16px 0", color: "#333" }}>Listado de parqueaderos</h3>

          {docs.length === 0 ? (
            <p style={{ color: "#999" }}>No hay parqueaderos registrados</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #eee" }}>
                    <th style={{ textAlign: "left", padding: "10px 8px", color: "#666" }}>Nombre</th>
                    <th style={{ textAlign: "left", padding: "10px 8px", color: "#666" }}>Dirección</th>
                    <th style={{ textAlign: "center", padding: "10px 8px", color: "#666" }}>Capacidad</th>
                    <th style={{ textAlign: "center", padding: "10px 8px", color: "#666" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {docs.map((p) => (
                    <tr key={p._id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td style={{ padding: "12px 8px", fontWeight: "bold" }}>{p.nombre}</td>
                      <td style={{ padding: "12px 8px", color: "#555" }}>{p.direccion}</td>
                      <td style={{ padding: "12px 8px", textAlign: "center", color: "#555" }}>{p.capacidad}</td>
                      <td style={{ padding: "12px 8px", textAlign: "center" }}>
                        <IconButton onClick={() => handleEdit(p)} color="primary">
                          <Edit />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(p._id)} color="error">
                          <Delete />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {parqueaderos.totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "16px" }}>
              <Button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                variant="outlined"
                size="small"
              >
                Anterior
              </Button>
              <span style={{ display: "flex", alignItems: "center", padding: "0 12px", color: "#666" }}>
                Pág {parqueaderos.page} de {parqueaderos.totalPages}
              </span>
              <Button
                disabled={page >= parqueaderos.totalPages}
                onClick={() => setPage(page + 1)}
                variant="outlined"
                size="small"
              >
                Siguiente
              </Button>
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
