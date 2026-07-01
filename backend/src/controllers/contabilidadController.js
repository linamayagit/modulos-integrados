const Contabilidad = require("../models/contabilidad");

exports.registrarMovimiento = async (req, res) => {
  try {
    const { tipo, monto, descripcion, responsable } = req.body;
    const nuevoMovimiento = new Contabilidad({ tipo, monto, descripcion, responsable });
    await nuevoMovimiento.save();
    res.status(201).json({ mensaje: "Movimiento registrado", movimiento: nuevoMovimiento });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al registrar movimiento", error });
  }
};

exports.listarMovimientos = async (req, res) => {
  try {
    const { page = 1, limit = 15, tipo } = req.query;
    const filter = {};
    if (tipo) filter.tipo = tipo;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { fecha: -1 },
    };

    const result = await Contabilidad.paginate(filter, options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al listar movimientos", error: error.message });
  }
};

exports.actualizarMovimiento = async (req, res) => {
  try {
    const { tipo, monto, descripcion, responsable } = req.body;
    const update = {};
    if (tipo) update.tipo = tipo;
    if (monto !== undefined) update.monto = monto;
    if (descripcion) update.descripcion = descripcion;
    if (responsable) update.responsable = responsable;

    const movimiento = await Contabilidad.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!movimiento) return res.status(404).json({ mensaje: "Movimiento no encontrado" });

    res.json({ mensaje: "Movimiento actualizado", movimiento });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar movimiento", error });
  }
};

exports.eliminarMovimiento = async (req, res) => {
  try {
    const movimiento = await Contabilidad.findByIdAndDelete(req.params.id);
    if (!movimiento) return res.status(404).json({ mensaje: "Movimiento no encontrado" });
    res.json({ mensaje: "Movimiento eliminado" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar movimiento", error });
  }
};

exports.movimientosPorDia = async (req, res) => {
  try {
    const { dias = 7 } = req.query;
    const desde = new Date();
    desde.setDate(desde.getDate() - parseInt(dias, 10));
    desde.setHours(0, 0, 0, 0);

    const result = await Contabilidad.aggregate([
      { $match: { fecha: { $gte: desde } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$fecha" } },
          ingresos: {
            $sum: { $cond: [{ $eq: ["$tipo", "Ingreso"] }, "$monto", 0] },
          },
          egresos: {
            $sum: { $cond: [{ $eq: ["$tipo", "Egreso"] }, "$monto", 0] },
          },
          cantidad: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    res.json(
      result.map((r) => ({
        fecha: r._id,
        ingresos: r.ingresos,
        egresos: r.egresos,
        balance: r.ingresos - r.egresos,
        cantidad: r.cantidad,
      }))
    );
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener movimientos por día", error: error.message });
  }
};

exports.resumenContabilidad = async (req, res) => {
  try {
    const [ingresos, egresos] = await Promise.all([
      Contabilidad.aggregate([
        { $match: { tipo: "Ingreso" } },
        { $group: { _id: null, total: { $sum: "$monto" }, count: { $sum: 1 } } }
      ]),
      Contabilidad.aggregate([
        { $match: { tipo: "Egreso" } },
        { $group: { _id: null, total: { $sum: "$monto" }, count: { $sum: 1 } } }
      ])
    ]);

    const totalIngresos = ingresos[0]?.total || 0;
    const totalEgresos = egresos[0]?.total || 0;

    res.json({
      totalIngresos,
      totalEgresos,
      balance: totalIngresos - totalEgresos,
      cantidadIngresos: ingresos[0]?.count || 0,
      cantidadEgresos: egresos[0]?.count || 0,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener resumen", error: error.message });
  }
};
