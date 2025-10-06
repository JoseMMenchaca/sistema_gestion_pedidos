import { sequelize } from "../database/db.js";
import { Pedido } from "../models/Pedido.js";
import { PedidoDetalle } from "../models/PedidoDetalle.js";


export const crearPedido = async (req, res) => {
    const t = await sequelize.transaction();
    const { monto, fechaPedido, metodoPago, estado, cliente_id, detalles } = req.body;

    try {
        const nuevoPedido = await Pedido.create({
            monto,
            fechaPedido,
            metodoPago,
            estado,
            cliente_id,
        },
            { transaction: t }
        );
        for (const detalle of detalles) {
            
            nuevoDetalle = await PedidoDetalle.create({
                producto_id: detalle.producto_id,
                cantidad: detalle.cantidad,
                precio_unitario: detalle.precio,
                notas_adicionales:detalle.notas,
                pedido_id: nuevoPedido.id
            }, { transaction: t });

        }
        await t.commit();

        res.status(201).json({
            mensaje: 'Pedio Registrado Correctamente',
            nuevoPedido
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const mostrarPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      include: [
        {
          model: Cliente,
          attributes: ["id", "nombre_cliente"],
        }
      ],
    });
    res.status(200).json(pedidos);
  }
  catch (error) {
    return res.status(500).json({ message: error.message });
  }
}


export const verDetallesPedido = async (req, res) => {
  const { pedido_id } = req.params;

  try {
    const pedido = await Pedido.findByPk(pedido_id, {
      include: [
        {
          model: Cliente,
          attributes: ["id", "nombre_cliente"],
        },
        {
          model: PedidoDetalle,
          include: [{
            model: Producto, 
            attributes: ['id', 'nombre'],
          }]
        }
      ],
    });

    if (!pedido) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    res.json({
      id: pedido.id,
      fechaPedido: pedido.fecha_pedido, 
      cliente: pedido.Cliente,
      pedido_detalles: pedido.PedidoDetalles, 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener detalles de Pedido",
      error: error.message 
    });
  }
}

export const actualizarEstadoPedido = async (req, res) => {
    const { pedido_id } = req.params;
    const { estado } = req.body; 
    try {
        const pedido = await Pedido.findByPk(pedido_id);
        if (!pedido) {
            return res.status(404).json({ 
                message: "Pedido no encontrado",
                ok: false,
                status: 404
            });
        }
        const estadoActualizado = await Pedido.update(
            { estado: estado }, 
            { where: { id: pedido_id } }
        );
        const pedidoActualizado = await Pedido.findByPk(pedido_id);


        res.status(200).json({
            message: "Estado del pedido actualizado exitosamente",
            ok: true,
            status: 200,
            body: pedidoActualizado,
        });
    }
    catch (error) {
        return res.status(500).json({ 
            message: "Error al actualizar el estado del pedido", 
            error: error.message 
        });
    }
}