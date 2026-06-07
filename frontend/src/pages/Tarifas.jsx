import { useEffect, useState } from "react";
import { TextField, Button, IconButton, MenuItem, Snackbar, Alert, Card, CardContent } from "@mui/material";
import { Delete, Edit, AttachMoney } from "@mui/icons-material";
import api from "../services/api";

export default function Tarifas() {
  const [tarifas, setTarifas] = useState([]);
  const [form, setForm] = useState({ tipoVehiculo: "", precioHora: "", precioDia: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  const tipos = ["Auto", "Moto", "Camioneta", "Bicicleta"];

  const cargarTarifas = async () => {
    try {
      const res = await api.get("/tarifas/listar");
      setTarifas(Array.isArray(res.data) ? res.data : []);
    } catch {
      setSnackbar({ open: true, message: "Error al cargar tarifas", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTarifas();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.tipoVehiculo || !form.precioHora || !form.precioDia) {
      setSnackbar({ open: true, message: "Todos los campos son obligatorios", severity: "error" });
      return;
    }
    if (Number(form.precioHora) < 0 || Number(form.precioDia) < 0) {
      setSnackbar({ open: true, message: "Los precios no pueden ser negativos", severity: "error" });
      return;
    }

    try {
      if (editId) {
        await api.put(`/tarifas/actualizar/${editId}`, {
          tipoVehiculo: form.tipoVehiculo,
          precioHora: Number(form.precioHora),
          precioDia: Number(form.precioDia),
        });
        setSnackbar({ open: true, message: "Tarifa actualizada", severity: "success" });
        setEditId(null);
      } else {
        await api.post("/tarifas/registrar", {
          tipoVehiculo: form.tipoVehiculo,
          precioHora: Number(form.precioHora),
          precioDia: Number(form.precioDia),
        });
        setSnackbar({ open: true, message: "Tarifa registrada", severity: "success" });
      }

      setForm({ tipoVehiculo: "", precioHora: "", precioDia: "" });
      await cargarTarifas();
    } catch (err) {
      const mensaje = err.response?.data?.mensaje || "Error guardando tarifa";
      setSnackbar({ open: true, message: mensaje, severity: "error" });
    }
  };

  const handleEdit = (t) => {
    setForm({
      tipoVehiculo: t.tipoVehiculo,
      precioHora: String(t.precioHora),
      precioDia: String(t.precioDia),
    });
    setEditId(t._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta tarifa?")) return;
    try {
      await api.delete(`/tarifas/eliminar/${id}`);
      setSnackbar({ open: true, message: "Tarifa eliminada", severity: "success" });
      await cargarTarifas();
    } catch {
      setSnackbar({ open: true, message: "Error al eliminar tarifa", severity: "error" });
    }
  };

  const formStyle = {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    alignItems: "flex-end",
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "60px" }}>
        <div>Cargando...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      <h1 style={{ margin: "0 0 24px 0", color: "#333" }}>Tarifas</h1>

      <Card style={{ marginBottom: "24px" }}>
        <CardContent>
          <h3 style={{ margin: "0 0 16px 0", color: "#333" }}>
            {editId ? "Editar tarifa" : "Registrar nueva tarifa"}
          </h3>
          <form onSubmit={handleSubmit} style={formStyle}>
            <TextField
              select
              name="tipoVehiculo"
              label="Tipo de vehículo"
              value={form.tipoVehiculo}
              onChange={handleChange}
              style={{ minWidth: "180px", flex: 1 }}
            >
              <MenuItem value="">-- Seleccionar --</MenuItem>
              {tipos.map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </TextField>

            <TextField
              name="precioHora"
              label="Precio por hora ($)"
              type="number"
              value={form.precioHora}
              onChange={handleChange}
              style={{ minWidth: "160px", flex: 1 }}
              inputProps={{ min: 0, step: "0.01" }}
            />

            <TextField
              name="precioDia"
              label="Precio por día ($)"
              type="number"
              value={form.precioDia}
              onChange={handleChange}
              style={{ minWidth: "160px", flex: 1 }}
              inputProps={{ min: 0, step: "0.01" }}
            />

            <Button
              type="submit"
              variant="contained"
              startIcon={editId ? <Edit /> : <AttachMoney />}
              sx={{ height: "56px" }}
            >
              {editId ? "Actualizar" : "Registrar"}
            </Button>

            {editId && (
              <Button
                variant="outlined"
                onClick={() => {
                  setEditId(null);
                  setForm({ tipoVehiculo: "", precioHora: "", precioDia: "" });
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
          <h3 style={{ margin: "0 0 16px 0", color: "#333" }}>Listado de tarifas</h3>

          {tarifas.length === 0 ? (
            <p style={{ color: "#999" }}>No hay tarifas registradas</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #eee" }}>
                    <th style={{ textAlign: "left", padding: "10px 8px", color: "#666" }}>Tipo</th>
                    <th style={{ textAlign: "right", padding: "10px 8px", color: "#666" }}>Precio por hora</th>
                    <th style={{ textAlign: "right", padding: "10px 8px", color: "#666" }}>Precio por día</th>
                    <th style={{ textAlign: "center", padding: "10px 8px", color: "#666" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {tarifas.map((t) => (
                    <tr key={t._id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td style={{ padding: "12px 8px", fontWeight: "bold" }}>{t.tipoVehiculo}</td>
                      <td style={{ padding: "12px 8px", textAlign: "right", color: "#555" }}>
                        ${Number(t.precioHora).toLocaleString("es-CO")}
                      </td>
                      <td style={{ padding: "12px 8px", textAlign: "right", color: "#555" }}>
                        ${Number(t.precioDia).toLocaleString("es-CO")}
                      </td>
                      <td style={{ padding: "12px 8px", textAlign: "center" }}>
                        <IconButton onClick={() => handleEdit(t)} color="primary">
                          <Edit />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(t._id)} color="error">
                          <Delete />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
