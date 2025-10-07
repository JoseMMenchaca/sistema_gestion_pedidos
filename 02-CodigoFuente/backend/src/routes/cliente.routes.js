import { Router } from "express";
import { crearCliente, 
         verClientes, 
         verCliente, 
         actualizarCliente, 
         verPedidosCliente } from "../controllers/cliente.controller.js";

const router = Router();

router.get("/clientes", verClientes);
router.post("/clientes", crearCliente);
router.get("/clientes/:id", verCliente);
router.put("/clientes/:id", actualizarCliente);
router.get("/clientes/:id/pedidos", verPedidosCliente);

export default router;
