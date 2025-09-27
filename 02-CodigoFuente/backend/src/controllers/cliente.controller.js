import { Cliente } from "../models/Cliente.js";
// import { Pedido } from "../models/Pedido.js";
export const getClientes = async (req, res) => {
    try {
        const clientes = await Cliente.findAll();
        res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createCliente = async (req, res) => {
    try {
        const { nombre, direccion, celular, email, estado } = req.body;
        const cliente = await Cliente.create({ nombre, direccion, celular, email, estado });
        res.status(201).json(cliente);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCliente = async (req, res) => {
    try {
        const cliente = await Cliente.findOne({ where: { id: req.params.id } });
        cliente.set(req.body);
        await cliente.save();
        res.status(200).json(cliente);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCliente = async (req, res) => {
    try {
        const cliente = await Cliente.findOne({ where: { id: req.params.id } });
        res.status(200).json(cliente);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getClientePedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.findAll({ where: { cliente_id: req.params.id } });
        res.status(200).json(pedidos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



