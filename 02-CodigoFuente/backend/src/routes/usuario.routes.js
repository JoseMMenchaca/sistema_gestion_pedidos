import { Router } from "express";
import { getAllUser,createUser, getUser,updateUser,deleteUser } from "../controllers/usuario.controller.js";

const router =Router();

router.get('/',getAllUser);
router.post('/',createUser);
router.get('/:id', getUser);
router.put('/:id',updateUser);
router.delete('/:id',deleteUser);

export default router;