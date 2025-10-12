import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.json("Servidor Comida FastExpress");
});

export default router;