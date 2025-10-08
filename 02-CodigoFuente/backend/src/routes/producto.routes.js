import { Router } from "express";
import { crearProducto, listarProductos, verProducto, editarProducto } from "../controllers/producto.controller.js";

const router = Router();

router.get("/", listarProductos); 
router.post("/", crearProducto);
router.get("/:id", verProducto);
router.put("/:id", editarProducto);

export default router;
