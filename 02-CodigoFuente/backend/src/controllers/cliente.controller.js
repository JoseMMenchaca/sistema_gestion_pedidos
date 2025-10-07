import { Cliente } from "../models/Cliente.js";
// import { Pedido } from "../models/Pedido.js";
export const verClientes = async (req, res) => {
    try {
        const clientes = await Cliente.findAll();
        res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const crearCliente = async (req, res) => {
    try {
        const { nombre, direccion, celular, email, estado } = req.body;
        const cliente = await Cliente.create({ nombre, direccion, celular, email, estado });
        res.status(201).json(cliente);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const actualizarCliente = async (req, res) => {
    try {
        const cliente = await Cliente.findOne({ where: { id: req.params.id } });
        cliente.set(req.body);
        await cliente.save();
        res.status(200).json(cliente);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const verCliente = async (req, res) => {
    try {
        const cliente = await Cliente.findOne({ where: { id: req.params.id } });
        res.status(200).json(cliente);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const verPedidosCliente = async (req, res) => {
    try {
        const pedidos = await Pedido.findAll({ where: { cliente_id: req.params.id } });
        res.status(200).json(pedidos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};