import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Usuarios from "./pages/Usuarios";
import Vehiculos from "./pages/Vehiculos";
import Layout from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login fuera del layout */}
        <Route path="/" element={<Login />} />

        {/* Todo lo que tiene Navbar va aquí */}
        <Route element={<Layout />}>
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/vehiculos" element={<Vehiculos />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;