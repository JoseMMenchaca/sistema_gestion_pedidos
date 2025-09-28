import { Producto } from "../models/Producto.js";
import { Categoria } from "../models/Categoria.js"; // Importamos el modelo Categoria

// Obtiene todos los productos incluyendo su categoría.

export const getProductos = async (req, res) => {
    try {
        const productos = await Producto.findAll({
            // Incluimos la información de la categoría asociada
            include: {
                model: Categoria,
                as: "categoria", //  alias  definido en  modelo Producto
                attributes: ["id", "nombre"], //  traemos atributos necesarios de Categoria
            },
            attributes: {
                // Excluimos los campos de llaves foráneas para una respuesta más limpia
                exclude: ["categoria_id", "categoriaId"] 
            }
        });
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtiene un producto específico por su ID, incluyendo su categoría.

export const getProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await Producto.findOne({
            where: { id },
            // información de la categoría
            include: {
                model: Categoria,
                as: "categoria",
                attributes: ["id", "nombre"],
            },
            attributes: {
                exclude: ["categoria_id", "categoriaId"]
            }
        });

        if (!producto) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.status(200).json(producto);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crea un nuevo producto, asociándolo a una categoría existente.

export const createProducto = async (req, res) => {
    // Agregamos categoria_id al destructuring
    const { nombre, descripcion, precio, stock, estado, categoria_id } = req.body;

    try {
        // 1. Verificamos que la categoría proporcionada exista
        const categoria = await Categoria.findByPk(categoria_id);
        if (!categoria) {
            return res.status(400).json({ message: "La categoría especificada no existe." });
        }

        // 2. Creamos el producto con la llave foránea
        const nuevoProducto = await Producto.create({
            nombre,
            descripcion,
            precio,
            stock,
            estado,
            categoria_id,
        });

        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Actualiza un producto existente por su ID.

export const updateProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { categoria_id } = req.body;

        const producto = await Producto.findByPk(id);

        // Verificamos si el producto existe
        if (!producto) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        // Si se está intentando cambiar la categoría, verificamos que la nueva categoría exista
        if (categoria_id) {
            const categoriaExiste = await Categoria.findByPk(categoria_id);
            if (!categoriaExiste) {
                return res.status(400).json({ message: "La nueva categoría especificada no existe." });
            }
        }

        // Actualizamos el producto con los datos del body
        producto.set(req.body);
        await producto.save();

        res.status(200).json(producto);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// import { Producto } from "../models/Producto.js";

// export const getProductos = async (req, res) => {
//     try {
//         const productos = await Producto.findAll();
//         res.status(200).json(productos);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// export const createProducto = async (req, res) => {
//     try {
//         const { nombre, descripcion, precio, stock, estado } = req.body;
//         const producto = await Producto.create({ nombre, descripcion, precio, stock, estado });
//         res.status(201).json(producto);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// export const updateProducto = async (req, res) => {
//     try {
//         const producto = await Producto.findOne({ where: { id: req.params.id } });
//         producto.set(req.body);
//         await producto.save();
//         res.status(200).json(producto);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// export const getProducto = async (req, res) => {
//     try {
//         const producto = await Producto.findOne({ where: { id: req.params.id } });
//         res.status(200).json(producto);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
