import { Router } from "express";
import { crearCliente, 
         verClientes, 
         verCliente, 
         actualizarCliente, 
         verPedidosCliente } from "../controllers/cliente.controller.js";

const router = Router();

router.get("/", verClientes);
router.post("/", crearCliente);
router.get("/:id", verCliente);
router.put("/:id", actualizarCliente);
router.get("/:id/pedidos", verPedidosCliente);

export default router;
