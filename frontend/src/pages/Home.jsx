import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CircularProgress } from "@mui/material";
import { DirectionsCar, People, Receipt, ArrowForward, LocalParking, AttachMoney, ConfirmationNumber, Garage, AccountBalance } from "@mui/icons-material";
import api from "../services/api";

const cardStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  flex: "1",
  minWidth: "200px",
  background: "white",
};

const iconContainer = (color) => ({
  width: "50px",
  height: "50px",
  borderRadius: "12px",
  background: color,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export default function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ vehiculos: 0, usuarios: 0, activos: 0, tarifas: 0, tickets: 0, parqueaderos: 0, contabilidad: 0 });
  const [ultimosVehiculos, setUltimosVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [vehiculosRes, usuariosRes, activosRes, tarifasRes, ticketsRes, parqueaderosRes, contabilidadRes] = await Promise.all([
          api.get("/vehiculos?limit=5"),
          api.get("/usuarios?limit=1"),
          api.get("/registros/listar?activos=true&limit=1"),
          api.get("/tarifas/listar"),
          api.get("/tickets/listar?limit=1"),
          api.get("/parqueaderos/listar?limit=1"),
          api.get("/contabilidad/listar?limit=1"),
        ]);

        const tarifasData = Array.isArray(tarifasRes.data) ? tarifasRes.data : [];

        setStats({
          vehiculos: vehiculosRes.data.totalDocs || 0,
          usuarios: usuariosRes.data.totalDocs || 0,
          activos: activosRes.data.totalDocs || 0,
          tarifas: tarifasData.length,
          tickets: ticketsRes.data?.totalDocs || 0,
          parqueaderos: parqueaderosRes.data?.totalDocs || 0,
          contabilidad: contabilidadRes.data?.totalDocs || 0,
        });
        setUltimosVehiculos(Array.isArray(vehiculosRes.data.docs) ? vehiculosRes.data.docs : []);
      } catch {
        setStats({ vehiculos: 0, usuarios: 0, activos: 0, tarifas: 0, tickets: 0, parqueaderos: 0, contabilidad: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const accesos = [
    { label: "Registros", path: "/registros", icon: <LocalParking />, color: "#ff9800" },
    { label: "Tickets", path: "/tickets", icon: <ConfirmationNumber />, color: "#e91e63" },
    { label: "Vehículos", path: "/vehiculos", icon: <DirectionsCar />, color: "#3EB489" },
    { label: "Parqueaderos", path: "/parqueaderos", icon: <Garage />, color: "#795548" },
    { label: "Tarifas", path: "/tarifas", icon: <AttachMoney />, color: "#9c27b0" },
    { label: "Usuarios", path: "/usuarios", icon: <People />, color: "#40E0D0" },
    { label: "Contabilidad", path: "/contabilidad", icon: <AccountBalance />, color: "#1976d2" },
  ];

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      <h1 style={{ margin: "0 0 24px 0", color: "#333" }}>Panel de Control</h1>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
          <CircularProgress />
        </div>
      ) : (
        <>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "24px" }}>
            <div style={cardStyle}>
              <div style={iconContainer("#3EB489")}>
                <DirectionsCar style={{ color: "white", fontSize: "28px" }} />
              </div>
              <div>
                <div style={{ fontSize: "28px", fontWeight: "bold", color: "#333" }}>
                  {stats.vehiculos}
                </div>
                <div style={{ color: "#666", fontSize: "14px" }}>Vehículos registrados</div>
              </div>
            </div>

            <div style={cardStyle}>
              <div style={iconContainer("#40E0D0")}>
                <People style={{ color: "white", fontSize: "28px" }} />
              </div>
              <div>
                <div style={{ fontSize: "28px", fontWeight: "bold", color: "#333" }}>
                  {stats.usuarios}
                </div>
                <div style={{ color: "#666", fontSize: "14px" }}>Usuarios del sistema</div>
              </div>
            </div>

            <div style={cardStyle}>
              <div style={iconContainer("#ff9800")}>
                <LocalParking style={{ color: "white", fontSize: "28px" }} />
              </div>
              <div>
                <div style={{ fontSize: "28px", fontWeight: "bold", color: "#333" }}>
                  {stats.activos}
                </div>
                <div style={{ color: "#666", fontSize: "14px" }}>En el parqueadero</div>
              </div>
            </div>

            <div style={cardStyle}>
              <div style={iconContainer("#9c27b0")}>
                <AttachMoney style={{ color: "white", fontSize: "28px" }} />
              </div>
              <div>
                <div style={{ fontSize: "28px", fontWeight: "bold", color: "#333" }}>
                  {stats.tarifas}
                </div>
                <div style={{ color: "#666", fontSize: "14px" }}>Tarifas registradas</div>
              </div>
            </div>

            <div style={cardStyle}>
              <div style={iconContainer("#e91e63")}>
                <ConfirmationNumber style={{ color: "white", fontSize: "28px" }} />
              </div>
              <div>
                <div style={{ fontSize: "28px", fontWeight: "bold", color: "#333" }}>
                  {stats.tickets}
                </div>
                <div style={{ color: "#666", fontSize: "14px" }}>Tickets generados</div>
              </div>
            </div>

            <div style={cardStyle}>
              <div style={iconContainer("#795548")}>
                <Garage style={{ color: "white", fontSize: "28px" }} />
              </div>
              <div>
                <div style={{ fontSize: "28px", fontWeight: "bold", color: "#333" }}>
                  {stats.parqueaderos}
                </div>
                <div style={{ color: "#666", fontSize: "14px" }}>Parqueaderos</div>
              </div>
            </div>

            <div style={cardStyle}>
              <div style={iconContainer("#1976d2")}>
                <AccountBalance style={{ color: "white", fontSize: "28px" }} />
              </div>
              <div>
                <div style={{ fontSize: "28px", fontWeight: "bold", color: "#333" }}>
                  {stats.contabilidad}
                </div>
                <div style={{ color: "#666", fontSize: "14px" }}>Movimientos contables</div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            <div style={{ flex: "2", minWidth: "300px" }}>
              <Card>
                <CardContent>
                  <h3 style={{ margin: "0 0 16px 0", color: "#333" }}>Últimos vehículos ingresados</h3>
                  {ultimosVehiculos.length === 0 ? (
                    <p style={{ color: "#999" }}>No hay vehículos registrados</p>
                  ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ borderBottom: "2px solid #eee" }}>
                          <th style={{ textAlign: "left", padding: "8px", color: "#666" }}>Placa</th>
                          <th style={{ textAlign: "left", padding: "8px", color: "#666" }}>Tipo</th>
                          <th style={{ textAlign: "left", padding: "8px", color: "#666" }}>Propietario</th>
                          <th style={{ textAlign: "left", padding: "8px", color: "#666" }}>Ingreso</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ultimosVehiculos.map((v) => (
                          <tr key={v._id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                            <td style={{ padding: "10px 8px", fontWeight: "bold" }}>{v.placa}</td>
                            <td style={{ padding: "10px 8px", color: "#555" }}>{v.tipo}</td>
                            <td style={{ padding: "10px 8px", color: "#555" }}>{v.propietario}</td>
                            <td style={{ padding: "10px 8px", color: "#555" }}>
                              {v.horaEntrada ? new Date(v.horaEntrada).toLocaleString("es-CO") : "--"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </CardContent>
              </Card>
            </div>

            <div style={{ flex: "1", minWidth: "250px" }}>
              <Card>
                <CardContent>
                  <h3 style={{ margin: "0 0 16px 0", color: "#333" }}>Accesos rápidos</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {accesos.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => navigate(item.path)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "14px 16px",
                          border: "1px solid #e0e0e0",
                          borderRadius: "8px",
                          background: "white",
                          cursor: "pointer",
                          fontSize: "15px",
                          color: "#333",
                          transition: "box-shadow 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)")}
                        onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div style={iconContainer(item.color)}>
                            {item.icon}
                          </div>
                          <span style={{ fontWeight: 500 }}>{item.label}</span>
                        </div>
                        <ArrowForward style={{ color: "#999", fontSize: "20px" }} />
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
