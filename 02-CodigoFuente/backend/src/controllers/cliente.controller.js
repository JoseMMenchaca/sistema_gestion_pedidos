import { Cliente } from "../models/Cliente.js";
import { Pedido } from "../models/Pedido.js";

export const getClientes = async (req, res) => {
    try {
        const clientes = await Cliente.findAll();
        res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
