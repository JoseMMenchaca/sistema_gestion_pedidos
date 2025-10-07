import { Router } from "express";
import { crearProducto, listarProductos, verProducto, editarProducto } from "../controllers/producto.controller.js";

const router = Router();

router.get("/productos", listarProductos); 
router.post("/productos", crearProducto);
router.get("/productos/:id", verProducto);
router.put("/productos/:id", editarProducto);

export default router;
