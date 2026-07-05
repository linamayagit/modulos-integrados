import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Usuarios from "./pages/Usuarios";
import Vehiculos from "./pages/Vehiculos";
import Parqueaderos from "./pages/Parqueaderos";
import Registros from "./pages/Registros";
import Tarifas from "./pages/Tarifas";
import Tickets from "./pages/Tickets";
import Contabilidad from "./pages/Contabilidad";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/vehiculos" element={<Vehiculos />} />
          <Route path="/parqueaderos" element={<Parqueaderos />} />
          <Route path="/registros" element={<Registros />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/tarifas" element={<ProtectedRoute><Tarifas /></ProtectedRoute>} />
          <Route path="/contabilidad" element={<ProtectedRoute><Contabilidad /></ProtectedRoute>} />
          <Route path="/usuarios" element={<ProtectedRoute><Usuarios /></ProtectedRoute>} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;