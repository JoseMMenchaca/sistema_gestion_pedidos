import { Sequelize } from "sequelize";
import { sequelize } from "../database/db.js";
import { Pedido } from "../models/Pedido.js";
import { PedidoDetalle } from "../models/PedidoDetalle.js";
import { Producto } from "../models/Producto.js";
import { Cliente } from "../models/Cliente.js";

// Crear un nuevo pedido con detalles
export const crearPedido = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { monto, fecha_pedido, metodo_pago, estado, cliente_id, detalles } = req.body;

        // Crear el pedido principal
        const nuevoPedido = await Pedido.create({
            monto,
            fecha_pedido,
            metodo_pago,
            estado,
            cliente_id
        }, { transaction: t });

        // Crear los detalles del pedido
        for (const detalle of detalles) {
            const producto = await Producto.findByPk(detalle.producto_id);
            if (!producto) {
                await t.rollback();
                return res.status(404).json({ message: `Producto con id ${detalle.producto_id} no encontrado` });
            }

            // Actualizar stock del producto
            await Producto.update(
                { stock: producto.stock - detalle.cantidad },
                { where: { id: detalle.producto_id }, transaction: t }
            );

            // Crear detalle del pedido
            await PedidoDetalle.create({
                pedido_id: nuevoPedido.id,
                producto_id: detalle.producto_id,
                cantidad: detalle.cantidad,
                precio_unitario: detalle.precio_unitario,
                notas_adicionales: detalle.notas_adicionales || ""
            }, { transaction: t });
        }

        await t.commit();

        res.status(201).json({
            message: "Pedido registrado correctamente",
            nuevoPedido
        });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ message: error.message });
    }
};

// Listar todos los pedidos con cliente y detalles
export const listarPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.findAll({
            include: [
                {
                    model: Cliente,
                    attributes: ["id", "nombre"],
                },
                {
                    model: PedidoDetalle,
                    as: "pedido_detalles",
                    include: [
                        {
                            model: Producto,
                            attributes: ["id", "nombre", "precio"]
                        }
                    ]
                }
            ],
            order: [["fecha_pedido", "DESC"]],
        });
        res.status(200).json(pedidos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener detalles de un pedido específico
export const verPedidoDetalles = async (req, res) => {
    const { id } = req.params;
    try {
        const pedido = await Pedido.findByPk(id, {
            include: [
                {
                    model: Cliente,
                    attributes: ["id", "nombre"]
                },
                {
                    model: PedidoDetalle,
                    include: [
                        {
                            model: Producto,
                            attributes: ["id", "nombre"]
                        }
                    ]
                }
            ]
        });

        if (!pedido)
             return res.status(404).json({ message: "Pedido no encontrado" });

        res.status(200).json(pedido);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un solo pedido
export const verPedido = async (req, res) => {
    const { id } = req.params;
    try {
        const pedido = await Pedido.findByPk(id);
        if (!pedido) return res.status(404).json({ message: "Pedido no encontrado" });
        res.status(200).json(pedido);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar pedido
export const actualizarPedido = async (req, res) => {
    const { id } = req.params;
    try {
        const pedido = await Pedido.findByPk(id);
        if (!pedido) return res.status(404).json({ message: "Pedido no encontrado" });

        pedido.set(req.body);
        await pedido.save();

        res.status(200).json({
            message: "Pedido actualizado correctamente",
            pedido
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
