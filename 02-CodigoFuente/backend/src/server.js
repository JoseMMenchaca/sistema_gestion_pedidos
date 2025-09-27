import express from "express"; 
import morgan from "morgan";
import indexRoutes from "./routes/index.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

import productoRoutes from "./routes/producto.routes.js";
import clienteRoutes from "./routes/cliente.routes.js";

const app = express();

app.set("port", process.env.PORT || 3000);

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../uploads"),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

app.use(indexRoutes); 
app.use("/api/productos", productoRoutes);
app.use("/api/clientes", clienteRoutes);

export default app;