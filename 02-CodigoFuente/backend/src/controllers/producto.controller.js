import { Producto } from "../models/Producto.js";

export const getProductos = async (req, res) => {
    try {
        const productos = await Producto.findAll();
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createProducto = async (req, res) => {
    try {
        const { nombre, descripcion, precio, stock, estado } = req.body;
        const producto = await Producto.create({ nombre, descripcion, precio, stock, estado });
        res.status(201).json(producto);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProducto = async (req, res) => {
    try {
        const producto = await Producto.findOne({ where: { id: req.params.id } });
        producto.set(req.body);
        await producto.save();
        res.status(200).json(producto);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProducto = async (req, res) => {
    try {
        const producto = await Producto.findOne({ where: { id: req.params.id } });
        res.status(200).json(producto);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
