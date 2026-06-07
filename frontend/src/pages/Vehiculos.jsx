import { useEffect, useState } from "react";
import { TextField, Button, IconButton, MenuItem, Snackbar, Alert } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import api from "../services/api";

export default function Vehiculos() {
  const [vehiculos, setVehiculos] = useState([]);
  const [nuevoVehiculo, setNuevoVehiculo] = useState({
    placa: "",
    tipo: "",
    modelo: "",
    propietario: "",
  });
  const [editId, setEditId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  async function cargarVehiculos() {
    try {
      const res = await api.get("/vehiculos");
      setVehiculos(Array.isArray(res.data) ? res.data : []);
    } catch {
      setSnackbar({ open: true, message: "Error al cargar vehículos", severity: "error" });
    }
  };

  useEffect(() => {
    cargarVehiculos(); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

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

      setNuevoVehiculo({ placa: "", tipo: "", modelo: "", propietario: "" });
      await cargarVehiculos();
    } catch (err) {
      const mensaje = err.response?.data?.mensaje || "Error guardando vehículo";
      setSnackbar({ open: true, message: mensaje, severity: "error" });
    }
  };

  const handleDelete = async (id) => {
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
      modelo: vehiculo.modelo,
      propietario: vehiculo.propietario,
    });
    setEditId(vehiculo._id);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🚗 Vehículos</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
      >
        <TextField name="placa" label="Placa" value={nuevoVehiculo.placa} onChange={handleChange} />
        <TextField select name="tipo" label="Tipo" value={nuevoVehiculo.tipo} onChange={handleChange} style={{ minWidth: "120px" }}>
          <MenuItem value="Auto">Auto</MenuItem>
          <MenuItem value="Moto">Moto</MenuItem>
          <MenuItem value="Camioneta">Camioneta</MenuItem>
        </TextField>
        <TextField name="modelo" label="Modelo" value={nuevoVehiculo.modelo} onChange={handleChange} />
        <TextField name="propietario" label="Propietario" value={nuevoVehiculo.propietario} onChange={handleChange} />
        <Button type="submit" variant="contained">{editId ? "Actualizar" : "Guardar"}</Button>
      </form>

      <table style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Placa</th>
            <th>Tipo</th>
            <th>Modelo</th>
            <th>Propietario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vehiculos.map((v) => (
            <tr key={v._id}>
              <td>{v.placa}</td>
              <td>{v.tipo}</td>
              <td>{v.modelo}</td>
              <td>{v.propietario}</td>
              <td>
                <IconButton onClick={() => handleEdit(v)}><Edit /></IconButton>
                <IconButton onClick={() => handleDelete(v._id)}><Delete /></IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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



