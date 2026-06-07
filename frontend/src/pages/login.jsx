import { useState } from "react";
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
} from "@mui/icons-material";
import logo from "../assets/logo_parqueadero.jpeg";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("ENTRO A HANDLESUBMIT");

    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            correo: email,
            contraseña: password,
          }),
        }
      );

      console.log("RESPUESTA RECIBIDA");

      const data = await response.json();

      console.log("Respuesta del servidor:", data);

      if (response.ok) {
        alert("✅ Login exitoso");

         {
          localStorage.setItem("token", data.token);
          console.log("VOY A REDIRIGIR A USUARIOS");
          navigate("/usuarios");
        }

        // Aquí después podrás redirigir
        // navigate("/dashboard");
      } else {
        alert("❌ " + data.mensaje);
      }
    } catch (error) {
      console.error("ERROR:", error);
      alert("❌ No se pudo conectar con el servidor");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f5f5f5",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "20px",
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
          <div
            style={{
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            <img
              src={logo}
              alt="ParkNet Logo"
              style={{
                width: "120px",
                marginBottom: "10px",
              }}
            />

            <h1>Bienvenido</h1>

            <p style={{ color: "#666" }}>
              Inicia sesión en tu cuenta
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                backgroundColor: "#87CEEB",
              }}
            >
              Iniciar sesión
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}





