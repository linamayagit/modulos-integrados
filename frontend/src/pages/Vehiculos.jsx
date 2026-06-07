import { useEffect, useState } from "react";
import { TextField, Button, IconButton, MenuItem } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import Navbar from "../components/Navbar";

export default function Vehiculos() {
  const [vehiculos, setVehiculos] = useState([]);

  const [nuevoVehiculo, setNuevoVehiculo] = useState({
    placa: "",
    tipo: "",
    modelo: "",
    propietario: "",
  });

  const [editId, setEditId] = useState(null);

  // 🔥 CARGAR VEHÍCULOS
  useEffect(() => {
    cargarVehiculos();
  }, []);

  const cargarVehiculos = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/vehiculos");
      const data = await res.json();
      setVehiculos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando vehículos:", err);
    }
  };

  // 🔥 CAMBIOS FORMULARIO
  const handleChange = (e) => {
    setNuevoVehiculo({
      ...nuevoVehiculo,
      [e.target.name]: e.target.value,
    });
  };

  // 🔥 CREAR / EDITAR
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await fetch(`http://localhost:3000/api/vehiculos/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevoVehiculo),
        });

        setEditId(null);
      } else {
        await fetch("http://localhost:3000/api/vehiculos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevoVehiculo),
        });
      }

      setNuevoVehiculo({
        placa: "",
        tipo: "",
        modelo: "",
        propietario: "",
      });

      await cargarVehiculos(); // 🔥 recarga limpia
    } catch (error) {
      console.error("Error guardando vehículo:", error);
    }
  };

  // 🔥 ELIMINAR
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/vehiculos/${id}`, {
        method: "DELETE",
      });

      await cargarVehiculos();
    } catch (error) {
      console.error("Error eliminando vehículo:", error);
    }
  };

  // 🔥 EDITAR
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
      <Navbar />

      <h2>🚗 Vehículos</h2>

      {/* FORMULARIO */}
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
      >
        <TextField
          name="placa"
          label="Placa"
          value={nuevoVehiculo.placa}
          onChange={handleChange}
        />

        <TextField
          select
          name="tipo"
          label="Tipo"
          value={nuevoVehiculo.tipo}
          onChange={handleChange}
          style={{ minWidth: "120px" }}
        >
          <MenuItem value="Auto">Auto</MenuItem>
          <MenuItem value="Moto">Moto</MenuItem>
          <MenuItem value="Camioneta">Camioneta</MenuItem>
        </TextField>

        <TextField
          name="modelo"
          label="Modelo"
          value={nuevoVehiculo.modelo}
          onChange={handleChange}
        />

        <TextField
          name="propietario"
          label="Propietario"
          value={nuevoVehiculo.propietario}
          onChange={handleChange}
        />

        <Button type="submit" variant="contained">
          {editId ? "Actualizar" : "Guardar"}
        </Button>
      </form>

      {/* TABLA */}
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
                <IconButton onClick={() => handleEdit(v)}>
                  <Edit />
                </IconButton>

                <IconButton onClick={() => handleDelete(v._id)}>
                  <Delete />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}



