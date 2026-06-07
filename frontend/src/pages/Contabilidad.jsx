import { useEffect, useState } from "react";
import {
  TextField, Button, MenuItem, Snackbar, Alert,
  Card, CardContent, CircularProgress
} from "@mui/material";
import { Add, Edit, Delete, TrendingUp, TrendingDown, AccountBalance } from "@mui/icons-material";
import api from "../services/api";

const chipIngreso = {
  display: "inline-block",
  padding: "2px 10px",
  borderRadius: "12px",
  fontSize: "12px",
  fontWeight: "bold",
  background: "#d4edda",
  color: "#155724",
};

const chipEgreso = {
  display: "inline-block",
  padding: "2px 10px",
  borderRadius: "12px",
  fontSize: "12px",
  fontWeight: "bold",
  background: "#f8d7da",
  color: "#721c24",
};

export default function Contabilidad() {
  const [movimientos, setMovimientos] = useState(null);
  const [resumen, setResumen] = useState({ totalIngresos: 0, totalEgresos: 0, balance: 0 });
  const [form, setForm] = useState({ tipo: "Ingreso", monto: "", descripcion: "", responsable: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  const cargarDatos = async () => {
    try {
      const [movimientosRes, resumenRes] = await Promise.all([
        api.get(`/contabilidad/listar?page=${page}&limit=15`),
        api.get("/contabilidad/resumen"),
      ]);
      setMovimientos(movimientosRes.data);
      setResumen(resumenRes.data);
    } catch {
      setSnackbar({ open: true, message: "Error al cargar datos", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [page]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.monto || form.monto <= 0) {
      setSnackbar({ open: true, message: "El monto debe ser un valor positivo", severity: "error" });
      return;
    }
    if (!form.descripcion || !form.responsable) {
      setSnackbar({ open: true, message: "Descripción y responsable son obligatorios", severity: "error" });
      return;
    }

    try {
      const payload = {
        tipo: form.tipo,
        monto: Number(form.monto),
        descripcion: form.descripcion,
        responsable: form.responsable,
      };

      if (editId) {
        await api.put(`/contabilidad/actualizar/${editId}`, payload);
        setSnackbar({ open: true, message: "Movimiento actualizado", severity: "success" });
        setEditId(null);
      } else {
        await api.post("/contabilidad/registrar", payload);
        setSnackbar({ open: true, message: "Movimiento registrado", severity: "success" });
      }

      setForm({ tipo: "Ingreso", monto: "", descripcion: "", responsable: "" });
      await cargarDatos();
    } catch (err) {
      const mensaje = err.response?.data?.mensaje || "Error al guardar movimiento";
      setSnackbar({ open: true, message: mensaje, severity: "error" });
    }
  };

  const handleEdit = (m) => {
    setForm({ tipo: m.tipo, monto: m.monto, descripcion: m.descripcion, responsable: m.responsable });
    setEditId(m._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este movimiento?")) return;
    try {
      await api.delete(`/contabilidad/eliminar/${id}`);
      setSnackbar({ open: true, message: "Movimiento eliminado", severity: "success" });
      await cargarDatos();
    } catch {
      setSnackbar({ open: true, message: "Error al eliminar movimiento", severity: "error" });
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "60px" }}>
        <CircularProgress />
      </div>
    );
  }

  const docs = movimientos?.docs ?? [];
  const totalDocs = movimientos?.totalDocs ?? 0;
  const totalPages = movimientos?.totalPages ?? 1;
  const currentPage = movimientos?.page ?? page;

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      <h1 style={{ margin: "0 0 24px 0", color: "#333" }}>Contabilidad</h1>

      <Card style={{ marginBottom: "24px" }}>
        <CardContent>
          <h3 style={{ margin: "0 0 16px 0", color: "#333" }}>
            {editId ? "Editar movimiento" : "Registrar movimiento"}
          </h3>
          <form onSubmit={handleSubmit} style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "flex-end" }}>
            <TextField
              select
              label="Tipo"
              value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value })}
              style={{ minWidth: "140px" }}
            >
              <MenuItem value="Ingreso">Ingreso</MenuItem>
              <MenuItem value="Egreso">Egreso</MenuItem>
            </TextField>

            <TextField
              label="Monto ($)"
              type="number"
              value={form.monto}
              onChange={(e) => setForm({ ...form, monto: e.target.value })}
              style={{ minWidth: "150px", flex: 1 }}
              inputProps={{ min: 0, step: "0.01" }}
            />

            <TextField
              label="Descripción"
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              style={{ minWidth: "220px", flex: 2 }}
            />

            <TextField
              label="Responsable"
              value={form.responsable}
              onChange={(e) => setForm({ ...form, responsable: e.target.value })}
              style={{ minWidth: "160px", flex: 1 }}
            />

            <Button
              type="submit"
              variant="contained"
              startIcon={editId ? <Edit /> : <Add />}
              sx={{ height: "56px" }}
            >
              {editId ? "Actualizar" : "Registrar"}
            </Button>

            {editId && (
              <Button
                variant="outlined"
                onClick={() => {
                  setEditId(null);
                  setForm({ tipo: "Ingreso", monto: "", descripcion: "", responsable: "" });
                }}
                sx={{ height: "56px" }}
              >
                Cancelar
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
        <div style={{ flex: "2", minWidth: "500px" }}>
          <Card>
            <CardContent>
              <h3 style={{ margin: "0 0 16px 0", color: "#333" }}>
                Movimientos ({totalDocs})
              </h3>

              {docs.length === 0 ? (
                <p style={{ color: "#999" }}>No hay movimientos registrados</p>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid #eee" }}>
                        <th style={{ textAlign: "left", padding: "8px", color: "#666" }}>Tipo</th>
                        <th style={{ textAlign: "left", padding: "8px", color: "#666" }}>Descripción</th>
                        <th style={{ textAlign: "right", padding: "8px", color: "#666" }}>Monto</th>
                        <th style={{ textAlign: "left", padding: "8px", color: "#666" }}>Responsable</th>
                        <th style={{ textAlign: "left", padding: "8px", color: "#666" }}>Fecha</th>
                        <th style={{ textAlign: "center", padding: "8px", color: "#666" }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {docs.map((m) => (
                        <tr key={m._id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                          <td style={{ padding: "10px 8px" }}>
                            <span style={m.tipo === "Ingreso" ? chipIngreso : chipEgreso}>
                              {m.tipo === "Ingreso" ? "Ingreso" : "Egreso"}
                            </span>
                          </td>
                          <td style={{ padding: "10px 8px", color: "#555" }}>{m.descripcion}</td>
                          <td style={{
                            padding: "10px 8px", textAlign: "right", fontWeight: "bold",
                            color: m.tipo === "Ingreso" ? "#155724" : "#721c24",
                          }}>
                            {m.tipo === "Ingreso" ? "+" : "-"}${Number(m.monto).toLocaleString("es-CO")}
                          </td>
                          <td style={{ padding: "10px 8px", color: "#555" }}>{m.responsable}</td>
                          <td style={{ padding: "10px 8px", color: "#555", fontSize: "13px" }}>
                            {new Date(m.fecha).toLocaleString("es-CO")}
                          </td>
                          <td style={{ padding: "10px 8px", textAlign: "center" }}>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<Edit />}
                              onClick={() => handleEdit(m)}
                              sx={{ mr: 1 }}
                            >
                              Editar
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              startIcon={<Delete />}
                              onClick={() => handleDelete(m._id)}
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
              <h3 style={{ margin: "0 0 16px 0", color: "#333" }}>Resumen financiero</h3>

              <div style={{ background: "#d4edda", borderRadius: "8px", padding: "16px", marginBottom: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <TrendingUp style={{ color: "#155724" }} />
                  <div style={{ color: "#155724", fontSize: "14px" }}>Total ingresos</div>
                </div>
                <div style={{ fontSize: "28px", fontWeight: "bold", color: "#155724" }}>
                  ${Number(resumen.totalIngresos).toLocaleString("es-CO")}
                </div>
              </div>

              <div style={{ background: "#f8d7da", borderRadius: "8px", padding: "16px", marginBottom: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <TrendingDown style={{ color: "#721c24" }} />
                  <div style={{ color: "#721c24", fontSize: "14px" }}>Total egresos</div>
                </div>
                <div style={{ fontSize: "28px", fontWeight: "bold", color: "#721c24" }}>
                  ${Number(resumen.totalEgresos).toLocaleString("es-CO")}
                </div>
              </div>

              <div style={{
                background: resumen.balance >= 0 ? "#cce5ff" : "#fff3cd",
                borderRadius: "8px", padding: "16px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <AccountBalance style={{ color: resumen.balance >= 0 ? "#004085" : "#856404" }} />
                  <div style={{ color: resumen.balance >= 0 ? "#004085" : "#856404", fontSize: "14px" }}>Balance</div>
                </div>
                <div style={{
                  fontSize: "28px", fontWeight: "bold",
                  color: resumen.balance >= 0 ? "#004085" : "#856404",
                }}>
                  ${Number(resumen.balance).toLocaleString("es-CO")}
                </div>
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
