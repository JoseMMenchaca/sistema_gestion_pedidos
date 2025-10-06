import { Router } from "express";
import { 
    createCliente, 
    getClientes, 
    getCliente, 
    updateCliente 
} from "../controllers/cliente.controller.js";

const router = Router();

router.get("/", getClientes);
router.post("/", createCliente);
router.get("/:id", getCliente);
router.put("/:id", updateCliente);

export default router;
