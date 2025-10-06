import { Router } from "express";
import { 
    crearPedido, 
    verDetallesPedido,
    actualizarEstadoPedido
} from "../controllers/pedido.controller";

const router=Router();

router.get("/", verDetallesPedido);
router.post("/", crearPedido);
router.patch("/:id", actualizarEstadoPedido);

export default router;