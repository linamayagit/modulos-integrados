import { useEffect, useState } from "react";
import {
  TextField, Button, MenuItem, Snackbar, Alert,
  Card, CardContent, CircularProgress, Autocomplete
} from "@mui/material";
import { PlayArrow, Stop, Delete, Search, ConfirmationNumber } from "@mui/icons-material";
import api from "../services/api";

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

export default function Tickets() {
  const [tickets, setTickets] = useState(null);
  const [vehiculos, setVehiculos] = useState([]);
  const [tarifas, setTarifas] = useState([]);
  const [form, setForm] = useState({ vehiculo: "", tarifa: "", horaEntrada: "" });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [soloActivos, setSoloActivos] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  const cargarDatos = async () => {
    try {
      const [vehiculosRes, tarifasRes, ticketsRes] = await Promise.all([
        api.get("/vehiculos?limit=200"),
        api.get("/tarifas/listar"),
        api.get(`/tickets/listar?page=${page}&limit=15`),
      ]);

      setVehiculos(Array.isArray(vehiculosRes.data.docs) ? vehiculosRes.data.docs : []);
      setTarifas(Array.isArray(tarifasRes.data) ? tarifasRes.data : []);
      setTickets(ticketsRes.data);
    } catch {
      setSnackbar({ open: true, message: "Error al cargar datos", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [page]);

  const tarifasPorTipo = (tipo) => tarifas.filter((t) => t.tipoVehiculo === tipo);

  const vehiculoSeleccionado = vehiculos.find((v) => v._id === form.vehiculo);

  const handleGenerarTicket = async (e) => {
    e.preventDefault();

    if (!form.vehiculo || !form.tarifa) {
      setSnackbar({ open: true, message: "Selecciona vehículo y tarifa", severity: "error" });
      return;
    }

    try {
      const payload = {
        vehiculo: form.vehiculo,
        tarifa: form.tarifa,
      };
      if (form.horaEntrada) payload.horaEntrada = form.horaEntrada;

      await api.post("/tickets/registrar", payload);
      setSnackbar({ open: true, message: "Ticket generado exitosamente", severity: "success" });
      setForm({ vehiculo: "", tarifa: "", horaEntrada: "" });
      await cargarDatos();
    } catch (err) {
      const data = err.response?.data;
      const mensaje = data?.mensaje || "Error al generar ticket";
      const detalle = data?.error ? ` (${data.error})` : "";
      setSnackbar({ open: true, message: mensaje + detalle, severity: "error" });
    }
  };

  const handleFinalizar = async (id) => {
    try {
      await api.put(`/tickets/finalizar/${id}`);
      setSnackbar({ open: true, message: "Ticket finalizado", severity: "success" });
      await cargarDatos();
    } catch (err) {
      const mensaje = err.response?.data?.mensaje || "Error al finalizar ticket";
      setSnackbar({ open: true, message: mensaje, severity: "error" });
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar este ticket?")) return;
    try {
      await api.delete(`/tickets/eliminar/${id}`);
      setSnackbar({ open: true, message: "Ticket eliminado", severity: "success" });
      await cargarDatos();
    } catch {
      setSnackbar({ open: true, message: "Error al eliminar ticket", severity: "error" });
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "60px" }}>
        <CircularProgress />
      </div>
    );
  }

  const docsTickets = tickets?.docs ?? [];
  const totalDocs = tickets?.totalDocs ?? 0;
  const totalPages = tickets?.totalPages ?? 1;
  const currentPage = tickets?.page ?? page;

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      <h1 style={{ margin: "0 0 24px 0", color: "#333" }}>Tickets de parqueadero</h1>

      <Card style={{ marginBottom: "24px" }}>
        <CardContent>
          <h3 style={{ margin: "0 0 16px 0", color: "#333" }}>Generar nuevo ticket</h3>
          <form onSubmit={handleGenerarTicket} style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "flex-end" }}>
            <Autocomplete
              options={vehiculos}
              getOptionLabel={(v) => `${v.placa} — ${v.propietario} (${v.tipo})`}
              value={vehiculos.find((v) => v._id === form.vehiculo) || null}
              onChange={(_, v) => setForm({ vehiculo: v?._id || "", tarifa: "", horaEntrada: form.horaEntrada })}
              isOptionEqualToValue={(o, v) => o._id === v._id}
              renderInput={(params) => (
                <TextField {...params} label="Vehículo (buscar por placa)" />
              )}
              style={{ minWidth: "300px", flex: 1 }}
              noOptionsText="Sin resultados"
            />

            <TextField
              select
              label="Tarifa"
              value={form.tarifa}
              onChange={(e) => setForm({ ...form, tarifa: e.target.value })}
              style={{ minWidth: "220px", flex: 1 }}
              disabled={!form.vehiculo}
            >
              <MenuItem value="">-- Seleccionar tarifa --</MenuItem>
              {(vehiculoSeleccionado
                ? tarifasPorTipo(vehiculoSeleccionado.tipo)
                : tarifas
              ).map((t) => (
                <MenuItem key={t._id} value={t._id}>
                  {t.tipoVehiculo} — ${t.precioHora}/h — ${t.precioDia}/día
                </MenuItem>
              ))}
            </TextField>

            <Button
              type="submit"
              variant="contained"
              startIcon={<ConfirmationNumber />}
              sx={{ height: "56px" }}
            >
              Generar Ticket
            </Button>
          </form>
        </CardContent>
      </Card>

      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
        <div style={{ flex: "2", minWidth: "500px" }}>
          <Card>
            <CardContent>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ margin: 0, color: "#333" }}>
                  {soloActivos ? "Tickets activos" : "Historial de tickets"}
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

              {docsTickets.length === 0 ? (
                <p style={{ color: "#999" }}>No hay tickets</p>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid #eee" }}>
                        <th style={{ textAlign: "left", padding: "8px", color: "#666" }}>N° Ticket</th>
                        <th style={{ textAlign: "left", padding: "8px", color: "#666" }}>Placa</th>
                        <th style={{ textAlign: "left", padding: "8px", color: "#666" }}>Tipo</th>
                        <th style={{ textAlign: "left", padding: "8px", color: "#666" }}>Tarifa</th>
                        <th style={{ textAlign: "left", padding: "8px", color: "#666" }}>Entrada</th>
                        <th style={{ textAlign: "left", padding: "8px", color: "#666" }}>Salida</th>
                        <th style={{ textAlign: "right", padding: "8px", color: "#666" }}>Total</th>
                        <th style={{ textAlign: "center", padding: "8px", color: "#666" }}>Estado</th>
                        <th style={{ textAlign: "center", padding: "8px", color: "#666" }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(soloActivos
                        ? docsTickets.filter((t) => !t.horaSalida)
                        : docsTickets
                      ).map((t) => (
                        <tr key={t._id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                          <td style={{ padding: "10px 8px", fontWeight: "bold", fontFamily: "monospace" }}>
                            {t.numeroTicket}
                          </td>
                          <td style={{ padding: "10px 8px" }}>{t.vehiculo?.placa || "---"}</td>
                          <td style={{ padding: "10px 8px", color: "#555" }}>{t.vehiculo?.tipo || "---"}</td>
                          <td style={{ padding: "10px 8px", color: "#555" }}>
                            {t.tarifa?.tipoVehiculo || "---"} — ${t.tarifa?.precioHora || 0}/h
                          </td>
                          <td style={{ padding: "10px 8px", color: "#555", fontSize: "13px" }}>
                            {t.horaEntrada ? new Date(t.horaEntrada).toLocaleString("es-CO") : "--"}
                          </td>
                          <td style={{ padding: "10px 8px", color: "#555", fontSize: "13px" }}>
                            {t.horaSalida ? new Date(t.horaSalida).toLocaleString("es-CO") : "--"}
                          </td>
                          <td style={{ padding: "10px 8px", textAlign: "right", fontWeight: "bold" }}>
                            {t.total != null ? `$${Number(t.total).toLocaleString("es-CO")}` : "--"}
                          </td>
                          <td style={{ padding: "10px 8px", textAlign: "center" }}>
                            <span style={t.horaSalida ? chipFinalizado : chipActivo}>
                              {t.horaSalida ? "Finalizado" : "Activo"}
                            </span>
                          </td>
                          <td style={{ padding: "10px 8px", textAlign: "center" }}>
                            {!t.horaSalida && (
                              <Button
                                size="small"
                                variant="contained"
                                color="warning"
                                startIcon={<Stop />}
                                onClick={() => handleFinalizar(t._id)}
                                sx={{ mr: 1 }}
                              >
                                Finalizar
                              </Button>
                            )}
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              startIcon={<Delete />}
                              onClick={() => handleEliminar(t._id)}
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

              {totalPages > 1 && (
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
                  {docsTickets.filter((t) => !t.horaSalida).length}
                </div>
                <div style={{ color: "#155724", fontSize: "14px" }}>Tickets activos</div>
              </div>

              <div style={{ background: "#f8d7da", borderRadius: "8px", padding: "16px", marginBottom: "12px" }}>
                <div style={{ fontSize: "28px", fontWeight: "bold", color: "#721c24" }}>
                  {docsTickets.filter((t) => t.horaSalida).length}
                </div>
                <div style={{ color: "#721c24", fontSize: "14px" }}>Tickets finalizados</div>
              </div>

              <div style={{ background: "#cce5ff", borderRadius: "8px", padding: "16px" }}>
                <div style={{ fontSize: "28px", fontWeight: "bold", color: "#004085" }}>
                  ${docsTickets.reduce((sum, t) => sum + (t.total || 0), 0).toLocaleString("es-CO")}
                </div>
                <div style={{ color: "#004085", fontSize: "14px" }}>Total recaudado</div>
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
