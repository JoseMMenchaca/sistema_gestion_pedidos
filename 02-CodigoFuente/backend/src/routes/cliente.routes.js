import { Router } from "express";
import { createCliente, 
         getClientes, 
         getCliente, 
         updateCliente, 
         getClientePedidos } from "../controllers/cliente.controller.js";

const router = Router();

router.get("/clientes", getClientes);
router.post("/clientes", createCliente);
router.get("/clientes/:id", getCliente);
router.put("/clientes/:id", updateCliente);
router.get("/clientes/:id/pedidos", getClientePedidos);

export default router;
