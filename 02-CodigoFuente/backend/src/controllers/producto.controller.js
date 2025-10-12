import { Sequelize, Op} from "sequelize";
import { Producto } from "../models/Producto.js";
import { Categoria } from "../models/Categoria.js";

import { PedidoDetalle } from "../models/PedidoDetalle.js"; 
import { Pedido } from "../models/Pedido.js"; 

//productos mas vendido
export const reporteProductosVendidos = async (req, res) => {
    // Recibimos las fechas de inicio y fin desde la URL (query parameters)
    const { fechaInicio, fechaFin } = req.query; 

    // Condición de filtro inicial
    let whereClause = {};
    if (fechaInicio && fechaFin) {
        whereClause = {
            fecha_pedido: {
                // Filtra entre la fecha de inicio (00:00:00) y la fecha de fin (23:59:59)
                [Sequelize.Op.between]: [
                    `${fechaInicio} 00:00:00`, 
                    `${fechaFin} 23:59:59`
                ]
            }
        };
    }
    
    try {
        const productosVendidos = await PedidoDetalle.findAll({
            // Incluimos el modelo Producto para obtener su ID y nombre.
            include: [
                {
                    model: Producto,
                    attributes: ["id", "nombre"],
                },
                // Incluimos Pedido solo para aplicar el filtro de fecha
                {
                    model: Pedido,
                    attributes: [], 
                    where: whereClause, 
                    required: true // Solo considera detalles que tengan un pedido dentro del rango de fechas
                }
            ],
            attributes: [
                // 1. Cantidad total vendida (SUMA de la columna 'cantidad')
                [Sequelize.fn('SUM', Sequelize.col('cantidad')), 'total_cantidad_vendida'],
                
                // 2. Monto total vendido (Usamos el alias de tabla 'pedido_detalle')
                [Sequelize.literal('SUM(pedido_detalle.cantidad * pedido_detalle.precio_unitario)'), 'total_monto_vendido'],
                
                // 3. 💡 SOLUCIÓN: Incluir explícitamente ID y Nombre del Producto
                // Esto es crucial cuando se usa raw: true con includes y agregaciones.
                [Sequelize.col('Producto.id'), 'producto.id'],
                [Sequelize.col('Producto.nombre'), 'producto.nombre'],
            ],
            // Agrupar por Producto, asegurando que los campos de agregación se calculen por producto único.
            group: ['Producto.id', 'Producto.nombre'], 
            // Ordenar por la cantidad vendida de forma descendente (los más vendidos primero)
            order: [[Sequelize.literal('total_cantidad_vendida'), 'DESC']], 
            // Esto es crucial para que los resultados devueltos sean un objeto plano con los aliases
            raw: true 
        });
        
        // Mapear el resultado para darle una estructura más limpia al frontend
        const resultadoMapeado = productosVendidos.map(item => ({
            // 💡 CORRECCIÓN: Usamos los aliases explícitos en minúscula (producto.id, producto.nombre)
            producto_id: item['producto.id'], 
            producto_nombre: item['producto.nombre'],
            total_cantidad_vendida: parseFloat(item.total_cantidad_vendida),
            total_monto_vendido: parseFloat(item.total_monto_vendido),
        }));

        res.status(200).json(resultadoMapeado);
    } catch (error) {
        console.error("Error en reporteProductosVendidos:", error);
        res.status(500).json({ message: error.message });
    }
};

// Listar todos los productos ACTIVOS con sus categorías
export async function listarProductos(req, res) {
  try {
    const productos = await Producto.findAll({
      where: { estado: true }, // Filtrar solo productos activos
      attributes: ["id", "nombre", "descripcion", "precio", "stock", "estado", "imagen"],
      include: [
        {
          model: Categoria,
          as: "categoria",
          attributes: ["id", "nombre"],
        },  
      ],
    });
    res.json(productos);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

// Listar todos los productos con sus categorías
export async function listarProductosGeneral(req, res) {
  try {
    const productos = await Producto.findAll({
      attributes: ["id", "nombre", "descripcion", "precio", "stock", "estado", "imagen"],
      include: [
        {
          model: Categoria,
          as: "categoria",
          attributes: ["id", "nombre"],
        },  
      ],
    });
    res.json(productos);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function crearProducto(req, res) {
  const {nombre, descripcion, precio, stock, estado, categoria_id} = req.body;
  console.log("Datos recibidos:", {nombre, descripcion, precio, stock, estado, categoria_id});
  console.log("Imagen recibida:", req.file);

  try {
    // Verificar si la categoría existe
    const categoria = await Categoria.findByPk(categoria_id);
    if (!categoria) {
      return res.status(400).json({ message: "Categoría no encontrada" });
    }

    // Obtener la ruta del archivo subido (si existe)
    const imagen = req.file ? `/uploads/${req.file.filename}` : null;

    // Crear el producto en la base de datos
    const newProducto = await Producto.create({
      nombre, 
      descripcion, 
      precio, 
      stock, 
      estado, 
      categoria_id,
      imagen,
    });

    res.status(201).json(newProducto);
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({
      message: error.message,
    });
  }
}


// Ver un producto por su ID
export async function verProducto(req, res) {
  const { id } = req.params;
  try {
    const producto = await Producto.findOne({
      where: { id },
    });
    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

// Editar un producto por su ID
export async function editarProducto(req, res) {
  const { id } = req.params;
  const { nombre, descripcion, precio, stock, estado, categoria_id } = req.body;

  try {
    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }


    // Si se sube una nueva imagen, actualizarla; de lo contrario, mantener la anterior
const imagen = req.file ? `/uploads/${req.file.filename}` : producto.imagen;

    producto.nombre = nombre;
    producto.descripcion = descripcion;
    producto.precio = precio;
    producto.stock = stock;
    producto.estado = estado;
    producto.categoria_id = categoria_id;
    producto.imagen = imagen; // Actualizar la imagen

    await producto.save();

    res.status(200).json(producto); // Responder con el producto actualizado
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}