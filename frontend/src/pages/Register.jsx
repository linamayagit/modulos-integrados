import { useState } from "react";
import { TextField, Button, MenuItem, Snackbar, Alert, InputAdornment } from "@mui/material";
import { Person, Email, Lock } from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    password: "",
    confirmarPassword: "",
    rol: "usuario",
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmarPassword) {
      setSnackbar({ open: true, message: "Las contraseñas no coinciden", severity: "error" });
      return;
    }

    if (form.password.length < 6) {
      setSnackbar({ open: true, message: "La contraseña debe tener al menos 6 caracteres", severity: "error" });
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/usuarios", {
        nombre: form.nombre,
        correo: form.correo,
        password: form.password,
        rol: form.rol,
      });

      if (response.status === 201) {
        setSnackbar({ open: true, message: "Usuario creado exitosamente. Redirigiendo al login...", severity: "success" });
        setTimeout(() => navigate("/"), 1500);
      }
    } catch (error) {
      const mensaje = error.response?.data?.mensaje || "Error al crear usuario";
      setSnackbar({ open: true, message: mensaje, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            padding: "30px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <h1 style={{ margin: 0 }}>Crear Cuenta</h1>
            <p style={{ color: "#666", marginTop: "8px" }}>
              Regístrate para acceder al sistema
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              name="nombre"
              label="Nombre completo"
              value={form.nombre}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              name="correo"
              label="Correo electrónico"
              type="email"
              value={form.correo}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              value={form.password}
              onChange={handleChange}
              margin="normal"
              required
              inputProps={{ minLength: 6 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              name="confirmarPassword"
              label="Confirmar contraseña"
              type="password"
              value={form.confirmarPassword}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              select
              name="rol"
              label="Rol"
              value={form.rol}
              onChange={handleChange}
              margin="normal"
            >
              <MenuItem value="usuario">Usuario</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                backgroundColor: "#3EB489",
                "&:hover": { backgroundColor: "#359c73" },
              }}
            >
              {loading ? "Registrando..." : "Registrarse"}
            </Button>
          </form>

          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <Link to="/" style={{ color: "#3EB489", textDecoration: "none" }}>
              ¿Ya tienes cuenta? Inicia sesión
            </Link>
          </div>
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
