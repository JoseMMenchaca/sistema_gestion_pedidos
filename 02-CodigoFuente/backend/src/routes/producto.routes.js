import { Router } from "express";
import upload from "../middlewares/upload.js";
import { 
    crearProducto, 
    listarProductos, 
    verProducto, 
    editarProducto} from "../controllers/producto.controller.js";

const router = Router();

router.post('/', upload.single("imagen"), crearProducto);

router.get("/", listarProductos);
router.get("/:id", verProducto);

router.put('/:id', upload.single("imagen"), editarProducto);

export default router;
