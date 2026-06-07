import { useEffect, useState } from "react";
import {
  TextField, Button, MenuItem, Snackbar, Alert,
  Card, CardContent, CircularProgress
} from "@mui/material";
import { PlayArrow, Stop, Delete, Search } from "@mui/icons-material";
import api from "../services/api";

const formContainer = {
  background: "white",
  borderRadius: "12px",
  padding: "20px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  marginBottom: "24px",
};

const chipActivo = {
  display: "inline-block",
  padding: "2px 10px",
  borderRadius: "12px",
  fontSize: "12px",
  fontWeight: "bold",
  background: "#d4edda",
  color: "#155724",
};

const chipFinalizado = {
  display: "inline-block",
  padding: "2px 10px",
  borderRadius: "12px",
  fontSize: "12px",
  fontWeight: "bold",
  background: "#f8d7da",
  color: "#721c24",
};

export default function Registros() {
  const [registros, setRegistros] = useState(null);
  const [vehiculos, setVehiculos] = useState([]);
  const [activos, setActivos] = useState([]);
  const [form, setForm] = useState({ vehiculo: "", observaciones: "" });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [soloActivos, setSoloActivos] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  const cargarDatos = async () => {
    try {
      const [vehiculosRes, activosRes, historialRes] = await Promise.all([
        api.get("/vehiculos?limit=100"),
        api.get("/registros/listar?activos=true&limit=50"),
        api.get(`/registros/listar?page=${page}&limit=15`),
      ]);

      setVehiculos(Array.isArray(vehiculosRes.data.docs) ? vehiculosRes.data.docs : []);
      setActivos(Array.isArray(activosRes.data.docs) ? activosRes.data.docs : []);
      setRegistros(historialRes.data);
    } catch {
      setSnackbar({ open: true, message: "Error al cargar datos", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [page]);

  const handleRegistrarEntrada = async (e) => {
    e.preventDefault();
    if (!form.vehiculo) {
      setSnackbar({ open: true, message: "Selecciona un vehículo", severity: "error" });
      return;
    }

    try {
      await api.post("/registros/entrada", {
        vehiculo: form.vehiculo,
        observaciones: form.observaciones,
      });
      setSnackbar({ open: true, message: "Entrada registrada exitosamente", severity: "success" });
      setForm({ vehiculo: "", observaciones: "" });
      await cargarDatos();
    } catch (err) {
      const mensaje = err.response?.data?.mensaje || "Error al registrar entrada";
      setSnackbar({ open: true, message: mensaje, severity: "error" });
    }
  };

  const handleRegistrarSalida = async (id) => {
    try {
      await api.put(`/registros/salida/${id}`);
      setSnackbar({ open: true, message: "Salida registrada", severity: "success" });
      await cargarDatos();
    } catch {
      setSnackbar({ open: true, message: "Error al registrar salida", severity: "error" });
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar este registro?")) return;
    try {
      await api.delete(`/registros/eliminar/${id}`);
      setSnackbar({ open: true, message: "Registro eliminado", severity: "success" });
      await cargarDatos();
    } catch {
      setSnackbar({ open: true, message: "Error al eliminar registro", severity: "error" });
    }
  };

  const calcularTiempo = (entrada, salida) => {
    if (!entrada) return "--";
    const inicio = new Date(entrada);
    const fin = salida ? new Date(salida) : new Date();
    const diffMs = fin - inicio;
    if (Number.isNaN(diffMs)) return "--";
    const horas = Math.floor(diffMs / (1000 * 60 * 60));
    const minutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    if (horas > 0) return `${horas}h ${minutos}m`;
    return `${minutos}m`;
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "60px" }}>
        <CircularProgress />
      </div>
    );
  }

  const docsHistorial = registros?.docs ?? [];
  const totalDocs = registros?.totalDocs ?? 0;
  const totalPages = registros?.totalPages ?? 1;
  const currentPage = registros?.page ?? page;

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      <h1 style={{ margin: "0 0 24px 0", color: "#333" }}>Control de Parqueadero</h1>

      <div style={formContainer}>
        <h3 style={{ margin: "0 0 16px 0", color: "#333" }}>Registrar entrada</h3>
        <form onSubmit={handleRegistrarEntrada} style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "flex-end" }}>
          <TextField
            select
            label="Vehículo"
            value={form.vehiculo}
            onChange={(e) => setForm({ ...form, vehiculo: e.target.value })}
            style={{ minWidth: "250px", flex: 1 }}
          >
            <MenuItem value="">-- Seleccionar vehículo --</MenuItem>
            {vehiculos
              .filter((v) => !activos.some((a) => a.vehiculo?._id === v._id))
              .map((v) => (
                <MenuItem key={v._id} value={v._id}>
                  {v.placa} — {v.tipo} — {v.propietario}
                </MenuItem>
              ))}
          </TextField>

          <TextField
            label="Observaciones"
            value={form.observaciones}
            onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
            style={{ flex: 1, minWidth: "200px" }}
          />

          <Button
            type="submit"
            variant="contained"
            startIcon={<PlayArrow />}
            sx={{ backgroundColor: "#3EB489", "&:hover": { backgroundColor: "#2a8f6a" }, height: "56px" }}
          >
            Registrar Entrada
          </Button>
        </form>
      </div>

      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
        <div style={{ flex: "2", minWidth: "400px" }}>
          <Card>
            <CardContent>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ margin: 0, color: "#333" }}>
                  {soloActivos ? "En el parqueadero" : "Historial de registros"}
                </h3>
                <Button
                  size="small"
                  variant={soloActivos ? "contained" : "outlined"}
                  onClick={() => setSoloActivos(!soloActivos)}
                  startIcon={<Search />}
                >
                  {soloActivos ? "Ver todos" : "Solo activos"}
                </Button>
              </div>

              {docsHistorial.length === 0 && activos.length === 0 ? (
                <p style={{ color: "#999" }}>No hay registros</p>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid #eee" }}>
                        <th style={{ textAlign: "left", padding: "8px", color: "#666" }}>Placa</th>
                        <th style={{ textAlign: "left", padding: "8px", color: "#666" }}>Tipo</th>
                        <th style={{ textAlign: "left", padding: "8px", color: "#666" }}>Entrada</th>
                        <th style={{ textAlign: "left", padding: "8px", color: "#666" }}>Salida</th>
                        <th style={{ textAlign: "left", padding: "8px", color: "#666" }}>Tiempo</th>
                        <th style={{ textAlign: "left", padding: "8px", color: "#666" }}>Estado</th>
                        <th style={{ textAlign: "left", padding: "8px", color: "#666" }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(soloActivos ? activos : docsHistorial).map((r) => (
                        <tr key={r._id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                          <td style={{ padding: "10px 8px", fontWeight: "bold" }}>
                            {r.vehiculo?.placa || "---"}
                          </td>
                          <td style={{ padding: "10px 8px", color: "#555" }}>
                            {r.vehiculo?.tipo || "---"}
                          </td>
                          <td style={{ padding: "10px 8px", color: "#555" }}>
                            {r.horaEntrada ? new Date(r.horaEntrada).toLocaleString("es-CO") : "--"}
                          </td>
                          <td style={{ padding: "10px 8px", color: "#555" }}>
                            {r.horaSalida ? new Date(r.horaSalida).toLocaleString("es-CO") : "--"}
                          </td>
                          <td style={{ padding: "10px 8px", color: "#555" }}>
                            {calcularTiempo(r.horaEntrada, r.horaSalida)}
                          </td>
                          <td style={{ padding: "10px 8px" }}>
                            <span style={r.horaSalida ? chipFinalizado : chipActivo}>
                              {r.horaSalida ? "Finalizado" : "Activo"}
                            </span>
                          </td>
                          <td style={{ padding: "10px 8px" }}>
                            {!r.horaSalida && (
                              <Button
                                size="small"
                                variant="contained"
                                color="warning"
                                startIcon={<Stop />}
                                onClick={() => handleRegistrarSalida(r._id)}
                                sx={{ mr: 1 }}
                              >
                                Salida
                              </Button>
                            )}
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              startIcon={<Delete />}
                              onClick={() => handleEliminar(r._id)}
                            >
                              Eliminar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {!soloActivos && totalPages > 1 && (
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
                    Pág {currentPage} de {totalPages}
                  </span>
                  <Button
                    disabled={page >= totalPages}
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
        </div>

        <div style={{ flex: "1", minWidth: "250px" }}>
          <Card>
            <CardContent>
              <h3 style={{ margin: "0 0 16px 0", color: "#333" }}>Resumen</h3>

              <div style={{ background: "#d4edda", borderRadius: "8px", padding: "16px", marginBottom: "12px" }}>
                <div style={{ fontSize: "28px", fontWeight: "bold", color: "#155724" }}>
                  {activos.length}
                </div>
                <div style={{ color: "#155724", fontSize: "14px" }}>Vehículos en el parqueadero</div>
              </div>

              <div style={{ background: "#f8d7da", borderRadius: "8px", padding: "16px", marginBottom: "12px" }}>
                <div style={{ fontSize: "28px", fontWeight: "bold", color: "#721c24" }}>
                  {totalDocs - activos.length}
                </div>
                <div style={{ color: "#721c24", fontSize: "14px" }}>Salidas registradas hoy</div>
              </div>

              <div style={{ background: "#cce5ff", borderRadius: "8px", padding: "16px" }}>
                <div style={{ fontSize: "28px", fontWeight: "bold", color: "#004085" }}>
                  {totalDocs || 0}
                </div>
                <div style={{ color: "#004085", fontSize: "14px" }}>Registros totales</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

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
