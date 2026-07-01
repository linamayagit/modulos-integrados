import { useEffect, useState } from "react";
import { TextField, Button, IconButton, MenuItem, Snackbar, Alert, Card, CardContent } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import api from "../services/api";

export default function Vehiculos() {
  const [vehiculos, setVehiculos] = useState({ docs: [], totalDocs: 0, page: 1, totalPages: 1 });
  const [nuevoVehiculo, setNuevoVehiculo] = useState({
    placa: "",
    tipo: "",
    color: "",
    propietario: "",
  });
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  async function cargarVehiculos() {
    try {
      const res = await api.get(`/vehiculos?page=${page}&limit=20`);
      setVehiculos(res.data);
    } catch {
      setSnackbar({ open: true, message: "Error al cargar vehículos", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarVehiculos(); // eslint-disable-line react-hooks/set-state-in-effect
  }, [page]);

  const handleChange = (e) => {
    setNuevoVehiculo({ ...nuevoVehiculo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await api.put(`/vehiculos/${editId}`, nuevoVehiculo);
        setEditId(null);
        setSnackbar({ open: true, message: "Vehículo actualizado", severity: "success" });
      } else {
        await api.post("/vehiculos", nuevoVehiculo);
        setSnackbar({ open: true, message: "Vehículo registrado", severity: "success" });
      }

      setNuevoVehiculo({ placa: "", tipo: "", color: "", propietario: "" });
      await cargarVehiculos();
    } catch (err) {
      const mensaje = err.response?.data?.mensaje || "Error guardando vehículo";
      setSnackbar({ open: true, message: mensaje, severity: "error" });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este vehículo?")) return;
    try {
      await api.delete(`/vehiculos/${id}`);
      await cargarVehiculos();
      setSnackbar({ open: true, message: "Vehículo eliminado", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Error al eliminar vehículo", severity: "error" });
    }
  };

  const handleEdit = (vehiculo) => {
    setNuevoVehiculo({
      placa: vehiculo.placa,
      tipo: vehiculo.tipo,
      color: vehiculo.color,
      propietario: vehiculo.propietario,
    });
    setEditId(vehiculo._id);
  };

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      <h1 style={{ margin: "0 0 24px 0", color: "#333" }}>Vehículos</h1>

      <Card style={{ marginBottom: "24px" }}>
        <CardContent>
          <h3 style={{ margin: "0 0 16px 0", color: "#333" }}>
            {editId ? "Editar vehículo" : "Registrar nuevo vehículo"}
          </h3>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "flex-end" }}
          >
            <TextField name="placa" label="Placa" value={nuevoVehiculo.placa} onChange={handleChange} />
            <TextField select name="tipo" label="Tipo" value={nuevoVehiculo.tipo} onChange={handleChange} style={{ minWidth: "120px" }}>
              <MenuItem value="Auto">Auto</MenuItem>
              <MenuItem value="Moto">Moto</MenuItem>
              <MenuItem value="Camioneta">Camioneta</MenuItem>
              <MenuItem value="Bicicleta">Bicicleta</MenuItem>
            </TextField>
            <TextField name="color" label="Color" value={nuevoVehiculo.color} onChange={handleChange} />
            <TextField name="propietario" label="Propietario" value={nuevoVehiculo.propietario} onChange={handleChange} />
            <Button type="submit" variant="contained">{editId ? "Actualizar" : "Guardar"}</Button>
            {editId && (
              <Button
                variant="outlined"
                onClick={() => {
                  setEditId(null);
                  setNuevoVehiculo({ placa: "", tipo: "", color: "", propietario: "" });
                }}
              >
                Cancelar
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h3 style={{ margin: "0 0 16px 0", color: "#333" }}>Listado de vehículos</h3>

          {vehiculos.docs.length === 0 ? (
            <p style={{ color: "#999" }}>No hay vehículos registrados</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #eee" }}>
                    <th style={{ textAlign: "left", padding: "10px 8px", color: "#666" }}>Placa</th>
                    <th style={{ textAlign: "left", padding: "10px 8px", color: "#666" }}>Tipo</th>
                    <th style={{ textAlign: "left", padding: "10px 8px", color: "#666" }}>Color</th>
                    <th style={{ textAlign: "left", padding: "10px 8px", color: "#666" }}>Propietario</th>
                    <th style={{ textAlign: "center", padding: "10px 8px", color: "#666" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {vehiculos.docs.map((v) => (
                    <tr key={v._id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td style={{ padding: "12px 8px", fontWeight: "bold" }}>{v.placa}</td>
                      <td style={{ padding: "12px 8px", color: "#555" }}>{v.tipo}</td>
                      <td style={{ padding: "12px 8px", color: "#555" }}>{v.color}</td>
                      <td style={{ padding: "12px 8px", color: "#555" }}>{v.propietario}</td>
                      <td style={{ padding: "12px 8px", textAlign: "center" }}>
                        <IconButton onClick={() => handleEdit(v)} color="primary"><Edit /></IconButton>
                        <IconButton onClick={() => handleDelete(v._id)} color="error"><Delete /></IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {vehiculos.totalPages > 1 && (
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
                Pág {vehiculos.page} de {vehiculos.totalPages}
              </span>
              <Button
                disabled={page >= vehiculos.totalPages}
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



