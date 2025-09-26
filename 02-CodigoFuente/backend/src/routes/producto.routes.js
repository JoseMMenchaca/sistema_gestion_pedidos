import { Router } from "express";
import { createProducto, getProductos, getProducto, updateProducto } from "../controllers/producto.controller.js";

const router = Router();

router.get("/productos", getProductos); // Listar todos los productos
router.post("/productos", createProducto); // Crear producto
router.get("/productos/:id", getProducto); // Obtener un producto específico
router.put("/productos/:id", updateProducto); // Actualizar producto

export default router;
