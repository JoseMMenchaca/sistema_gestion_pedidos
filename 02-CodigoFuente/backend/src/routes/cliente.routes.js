import { Router } from "express";
import { 
    crearCliente, 
    listarClientes, 
    verCliente, 
    actualizarCliente,
    verClientePedidos 
} from "../controllers/cliente.controller.js";

const router = Router();

router.get("/", listarClientes);
router.post("/", crearCliente);
router.get("/:id", verCliente);
router.put("/:id", actualizarCliente);
router.get("/:id/pedidos", verClientePedidos);

export default router;