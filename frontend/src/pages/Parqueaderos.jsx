import { useEffect, useState } from "react";
import { Snackbar, Alert, Card, CardContent, CircularProgress, TextField, Button } from "@mui/material";
import { LocalParking, DirectionsCar, CheckCircle, Edit, Save, Close } from "@mui/icons-material";
import api from "../services/api";

const colorDisponibles = (disp, total) => {
  const pct = disp / total;
  if (pct > 0.3) return { bg: "#d4edda", text: "#155724" };
  if (pct > 0.1) return { bg: "#fff3cd", text: "#856404" };
  return { bg: "#f8d7da", text: "#721c24" };
};

export default function Parqueaderos() {
  const [parqueaderos, setParqueaderos] = useState({ docs: [], resumen: { capacidadTotal: 0, ocupados: 0, disponibles: 0 } });
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const [editandoId, setEditandoId] = useState(null);
  const [editandoCapacidad, setEditandoCapacidad] = useState("");

  const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  const handleIniciarEdicion = (p) => {
    setEditandoId(p._id);
    setEditandoCapacidad(String(p.capacidad));
  };

  const handleGuardar = async (id) => {
    const val = parseInt(editandoCapacidad, 10);
    if (!val || val < 1) {
      setSnackbar({ open: true, message: "La capacidad debe ser al menos 1", severity: "error" });
      return;
    }
    try {
      await api.put(`/parqueaderos/actualizar/${id}`, { capacidad: val });
      setSnackbar({ open: true, message: "Capacidad actualizada", severity: "success" });
      setEditandoId(null);
      await cargarDatos();
    } catch {
      setSnackbar({ open: true, message: "Error al actualizar capacidad", severity: "error" });
    }
  };

  const handleCancelar = () => {
    setEditandoId(null);
    setEditandoCapacidad("");
  };

  const cargarDatos = async () => {
    try {
      const res = await api.get("/parqueaderos/listar?limit=50");
      setParqueaderos(res.data);
    } catch {
      setSnackbar({ open: true, message: "Error al cargar datos", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "60px" }}>
        <CircularProgress />
      </div>
    );
  }

  const docs = parqueaderos.docs ?? [];
  const { capacidadTotal = 0, ocupados = 0, disponibles = 0 } = parqueaderos.resumen || {};
  const colores = colorDisponibles(disponibles, capacidadTotal);

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      <h1 style={{ margin: "0 0 24px 0", color: "#333" }}>Parqueadero</h1>

      {/* Tarjetas de resumen */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
        <Card style={{ flex: 1, minWidth: "200px" }}>
          <CardContent style={{ textAlign: "center", padding: "24px" }}>
            <LocalParking style={{ fontSize: 40, color: "#1976d2", marginBottom: "8px" }} />
            <div style={{ fontSize: 14, color: "#666" }}>Capacidad total</div>
            <div style={{ fontSize: 36, fontWeight: "bold", color: "#333" }}>{capacidadTotal}</div>
          </CardContent>
        </Card>

        <Card style={{ flex: 1, minWidth: "200px" }}>
          <CardContent style={{ textAlign: "center", padding: "24px" }}>
            <DirectionsCar style={{ fontSize: 40, color: "#ff9800", marginBottom: "8px" }} />
            <div style={{ fontSize: 14, color: "#666" }}>Ocupados</div>
            <div style={{ fontSize: 36, fontWeight: "bold", color: "#ff9800" }}>{ocupados}</div>
          </CardContent>
        </Card>

        <Card style={{ flex: 1, minWidth: "200px", background: colores.bg }}>
          <CardContent style={{ textAlign: "center", padding: "24px" }}>
            <CheckCircle style={{ fontSize: 40, color: colores.text, marginBottom: "8px" }} />
            <div style={{ fontSize: 14, color: colores.text }}>Disponibles</div>
            <div style={{ fontSize: 36, fontWeight: "bold", color: colores.text }}>{disponibles}</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de parqueaderos */}
      <Card>
        <CardContent>
          <h3 style={{ margin: "0 0 16px 0", color: "#333" }}>Sedes</h3>

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
                      <td style={{ padding: "12px 8px", textAlign: "center", color: "#555" }}>
                        {editandoId === p._id ? (
                          <TextField
                            size="small"
                            type="number"
                            value={editandoCapacidad}
                            onChange={(e) => setEditandoCapacidad(e.target.value)}
                            slotProps={{ htmlInput: { min: 1, style: { textAlign: "center", width: "70px" } } }}
                          />
                        ) : (
                          p.capacidad
                        )}
                      </td>
                      <td style={{ padding: "12px 8px", textAlign: "center" }}>
                        {editandoId === p._id ? (
                          <>
                            <Button size="small" variant="contained" color="success" startIcon={<Save />} onClick={() => handleGuardar(p._id)} sx={{ mr: 1 }}>
                              Guardar
                            </Button>
                            <Button size="small" variant="outlined" startIcon={<Close />} onClick={handleCancelar}>
                              Cancelar
                            </Button>
                          </>
                        ) : (
                          <Button size="small" variant="outlined" startIcon={<Edit />} onClick={() => handleIniciarEdicion(p)}>
                            Editar
                          </Button>
                        )}
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
