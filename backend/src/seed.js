require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Usuario = require("./models/usuario");
const Vehiculo = require("./models/Vehiculo");
const Tarifa = require("./models/tarifa");
const Parqueadero = require("./models/parqueadero");
const Registro = require("./models/registro");
const Ticket = require("./models/ticket");
const Contabilidad = require("./models/contabilidad");

const calcularTotalTicket = (horaEntrada, horaSalida, tarifa) => {
  const diffMs = horaSalida.getTime() - horaEntrada.getTime();
  const horasDecimal = diffMs / (1000 * 60 * 60);
  const horas = Math.max(1, Math.round(horasDecimal * 2) / 2);
  const usaPrecioDia = horas >= 24;
  return usaPrecioDia
    ? Math.ceil(horas / 24) * tarifa.precioDia
    : horas * tarifa.precioHora;
};

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado a MongoDB\n");

    // ── Limpiar datos existentes ──
    await Promise.all([
      Usuario.deleteMany({}),
      Vehiculo.deleteMany({}),
      Tarifa.deleteMany({}),
      Parqueadero.deleteMany({}),
      Registro.deleteMany({}),
      Ticket.deleteMany({}),
      Contabilidad.deleteMany({}),
    ]);
    console.log("🗑️  Colecciones limpiadas\n");

    const salt = await bcrypt.genSalt(10);
    const hash = (pwd) => bcrypt.hash(pwd, salt);

    // ── Usuarios ──
    const usuarios = await Usuario.insertMany([
      { nombre: "Administrador", correo: "admin@parknet.com", password: await hash("admin123"), rol: "admin" },
      { nombre: "Carlos Pérez", correo: "carlos@parknet.com", password: await hash("operador123"), rol: "usuario" },
      { nombre: "María Gómez", correo: "maria@parknet.com", password: await hash("operador123"), rol: "usuario" },
      { nombre: "Luis Ramírez", correo: "luis@parknet.com", password: await hash("operador123"), rol: "usuario" },
    ]);
    console.log(`👤 ${usuarios.length} usuarios creados`);

    // ── Parqueaderos ──
    const parqueaderos = await Parqueadero.insertMany([
      { nombre: "Parqueadero Central", direccion: "Calle 50 #20-30", capacidad: 100 },
      { nombre: "Parqueadero Norte", direccion: "Av 68 #45-10", capacidad: 80 },
      { nombre: "Parqueadero Sur", direccion: "Cra 30 #10-5", capacidad: 60 },
    ]);
    console.log(`🏢 ${parqueaderos.length} parqueaderos creados`);

    // ── Tarifas ──
    const tarifas = await Tarifa.insertMany([
      { tipoVehiculo: "Carro", precioHora: 5000, precioDia: 40000 },
      { tipoVehiculo: "Moto", precioHora: 2000, precioDia: 15000 },
      { tipoVehiculo: "Bicicleta", precioHora: 1000, precioDia: 8000 },
      { tipoVehiculo: "Camión", precioHora: 8000, precioDia: 60000 },
    ]);
    console.log(`💰 ${tarifas.length} tarifas creadas`);

    const tarifaCarro = tarifas[0];
    const tarifaMoto = tarifas[1];
    const tarifaBici = tarifas[2];
    const tarifaCamion = tarifas[3];

    // ── Vehículos ──
    const ahora = new Date();
    const hace = (horas) => new Date(ahora.getTime() - horas * 3600000);

    const vehiculos = await Vehiculo.insertMany([
      { placa: "ABC-123", tipo: "Carro", color: "Rojo", propietario: "Carlos Pérez", horaEntrada: hace(2) },
      { placa: "DEF-456", tipo: "Carro", color: "Azul", propietario: "María Gómez", horaEntrada: hace(5) },
      { placa: "GHI-789", tipo: "Carro", color: "Negro", propietario: "Pedro López", horaEntrada: hace(1) },
      { placa: "JKL-012", tipo: "Carro", color: "Blanco", propietario: "Ana Martínez", horaEntrada: hace(48) },
      { placa: "MNO-345", tipo: "Moto", color: "Roja", propietario: "Luis Ramírez", horaEntrada: hace(3) },
      { placa: "PQR-678", tipo: "Moto", color: "Negra", propietario: "Sofía Torres", horaEntrada: hace(6) },
      { placa: "STU-901", tipo: "Moto", color: "Azul", propietario: "Diego Castro", horaEntrada: hace(0.5) },
      { placa: "VWX-234", tipo: "Camión", color: "Verde", propietario: "Jorge Medina", horaEntrada: hace(4) },
      { placa: "YZA-567", tipo: "Bicicleta", color: "Gris", propietario: "Laura Vega", horaEntrada: hace(1.5) },
      { placa: "BCD-890", tipo: "Carro", color: "Plateado", propietario: "Roberto Ruiz", horaEntrada: hace(0.25) },
    ]);
    console.log(`🚗 ${vehiculos.length} vehículos creados`);

    // ── Registros ──
    // 5 activos (sin horaSalida)
    const registrosActivos = await Registro.insertMany([
      { vehiculo: vehiculos[0]._id, horaEntrada: hace(2), horaSalida: null, observaciones: "Puesto 12" },
      { vehiculo: vehiculos[4]._id, horaEntrada: hace(3), horaSalida: null, observaciones: "Puesto 5" },
      { vehiculo: vehiculos[6]._id, horaEntrada: hace(0.5), horaSalida: null, observaciones: "Puesto 8" },
      { vehiculo: vehiculos[7]._id, horaEntrada: hace(4), horaSalida: null, observaciones: "Puesto 20" },
      { vehiculo: vehiculos[9]._id, horaEntrada: hace(0.25), horaSalida: null, observaciones: "Puesto 3" },
    ]);

    // 5 finalizados (con horaSalida)
    const registrosFinalizados = await Registro.insertMany([
      { vehiculo: vehiculos[1]._id, horaEntrada: hace(8), horaSalida: hace(2), observaciones: "Salida normal" },
      { vehiculo: vehiculos[2]._id, horaEntrada: hace(6), horaSalida: hace(1), observaciones: "Sin novedades" },
      { vehiculo: vehiculos[5]._id, horaEntrada: hace(10), horaSalida: hace(4), observaciones: "Salida" },
      { vehiculo: vehiculos[3]._id, horaEntrada: hace(72), horaSalida: hace(48), observaciones: "Estadía larga" },
      { vehiculo: vehiculos[8]._id, horaEntrada: hace(4), horaSalida: hace(1.5), observaciones: "Cliente frecuente" },
    ]);
    console.log(`📋 ${registrosActivos.length + registrosFinalizados.length} registros creados (${registrosActivos.length} activos)`);

    // ── Tickets ──
    // 3 activos (sin horaSalida, sin total)
    const ticketsActivos = await Ticket.insertMany([
      { numeroTicket: "TKT-0001", vehiculo: vehiculos[0]._id, tarifa: tarifaCarro._id, horaEntrada: hace(2), horaSalida: null, total: null },
      { numeroTicket: "TKT-0002", vehiculo: vehiculos[4]._id, tarifa: tarifaMoto._id, horaEntrada: hace(3), horaSalida: null, total: null },
      { numeroTicket: "TKT-0003", vehiculo: vehiculos[7]._id, tarifa: tarifaCamion._id, horaEntrada: hace(4), horaSalida: null, total: null },
    ]);

    // 5 finalizados (con horaSalida y total calculado)
    const ticketsData = [
      { nt: "TKT-0004", vehiculo: vehiculos[1]._id, tarifa: tarifaCarro._id, entrada: hace(8), salida: hace(2) },
      { nt: "TKT-0005", vehiculo: vehiculos[5]._id, tarifa: tarifaMoto._id, entrada: hace(10), salida: hace(4) },
      { nt: "TKT-0006", vehiculo: vehiculos[2]._id, tarifa: tarifaCarro._id, entrada: hace(6), salida: hace(1) },
      { nt: "TKT-0007", vehiculo: vehiculos[3]._id, tarifa: tarifaCarro._id, entrada: hace(72), salida: hace(48) },
      { nt: "TKT-0008", vehiculo: vehiculos[8]._id, tarifa: tarifaBici._id, entrada: hace(4), salida: hace(1.5) },
    ];

    const getTarifa = (ticketData) => tarifas.find((t) => t._id.equals(ticketData.tarifa));

    for (const td of ticketsData) {
      const tarifa = getTarifa(td);
      td.total = calcularTotalTicket(td.entrada, td.salida, tarifa);
    }

    const ticketsFinalizados = await Ticket.insertMany(
      ticketsData.map((td) => ({
        numeroTicket: td.nt,
        vehiculo: td.vehiculo,
        tarifa: td.tarifa,
        horaEntrada: td.entrada,
        horaSalida: td.salida,
        total: td.total,
      }))
    );
    console.log(`🎫 ${ticketsActivos.length + ticketsFinalizados.length} tickets creados (${ticketsActivos.length} activos)`);

    // ── Contabilidad ──
    const totalRecaudado = ticketsFinalizados.reduce((sum, t) => sum + t.total, 0);

    await Contabilidad.insertMany([
      { tipo: "Ingreso", monto: totalRecaudado, descripcion: "Recaudo tickets finalizados", fecha: hace(2), responsable: "Administrador" },
      { tipo: "Egreso", monto: 50000, descripcion: "Pago servicios públicos", fecha: hace(48), responsable: "Administrador" },
      { tipo: "Egreso", monto: 120000, descripcion: "Mantenimiento equipos", fecha: hace(72), responsable: "Administrador" },
      { tipo: "Ingreso", monto: 15000, descripcion: "Venta tarjeta mensual", fecha: hace(12), responsable: "María Gómez" },
      { tipo: "Egreso", monto: 35000, descripcion: "Compra insumos oficina", fecha: hace(24), responsable: "Administrador" },
    ]);
    console.log(`📊 5 movimientos contables creados`);

    // ── Resumen ──
    console.log("\n" + "=".repeat(50));
    console.log("✅ SEED COMPLETADO EXITOSAMENTE");
    console.log("=".repeat(50));
    console.log("\n📧 Admin: admin@parknet.com / admin123 (rol: admin)");
    console.log("📧 Operadores: carlos@parknet.com / operador123");
    console.log("              maria@parknet.com / operador123");
    console.log("              luis@parknet.com / operador123");
    console.log(`\n💰 Total recaudado en tickets: $${totalRecaudado.toLocaleString("es-CO")}`);

    await mongoose.disconnect();
    console.log("\n🔌 Desconectado de MongoDB");
  } catch (error) {
    console.error("❌ Error en seed:", error);
    process.exit(1);
  }
}

seed();
