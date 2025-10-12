import { Router } from "express";
import {
    crearPedido,
    listarPedidos,
    verPedidoDetalles,
    verPedido,
    actualizarPedido
} from "../controllers/pedido.controller.js";

const router=Router();

router.get("/", listarPedidos);
router.post("/", crearPedido);
router.put("/:id", actualizarPedido);
//mostrar un solo registro
router.get("/:id", verPedido);
router.get("/:id/detalles", verPedidoDetalles);



export default router;