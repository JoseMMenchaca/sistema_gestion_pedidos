import { Router } from "express";
import { listarCategorias, crearCategoria, verCategoria, actualizarCategoria } from "../controllers/categoria.controller.js";
const router = Router();

router.get('/', listarCategorias);
router.post('/', crearCategoria);
router.get('/:id', verCategoria);
router.put('/:id', actualizarCategoria);

export default router; 