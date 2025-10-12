import { Router } from "express";
import upload from "../middlewares/upload.js";
import { 
    crearProducto, 
    listarProductos, 
    listarProductosGeneral,
    verProducto, 
    editarProducto,
    reporteProductosVendidos
} from "../controllers/producto.controller.js";

const router = Router();

router.get("/reporte-vendidos", reporteProductosVendidos); 
router.get("/lista", listarProductosGeneral);
router.get("/:id", verProducto);
router.post('/', upload.single("imagen"), crearProducto);
router.get("/", listarProductos);
router.put('/:id', upload.single("imagen"), editarProducto);

export default router;