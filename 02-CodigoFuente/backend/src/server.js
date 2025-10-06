import express from "express"; 
import morgan from "morgan";
import indexRoutes from "./routes/index.js";
import { sequelize, initializeDB } from "./database/db.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import productoRoutes from "./routes/producto.routes.js";
import clienteRoutes from "./routes/cliente.routes.js";
import usuarioRoutes from "./routes/usuario.routes.js";
import categoriaRoutes from "./routes/categoria.routes.js";

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
const upload = multer({ storage });

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(indexRoutes); 
app.use("/api/productos", productoRoutes);
app.use("/api/clientes", clienteRoutes);

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/categoria", categoriaRoutes);

try {
  app.listen(app.get("port"), () => {
    console.log(`Servidor corriendo en el puerto ${app.get("port")}`);
  });
} catch (error) {
  console.error("Error al conectar al servidor", error);
}

//   function verifyToken(req, res, next) {
//     const bearerHeader=req.headers['authorization'];
//     if (typeof bearerHeader!=='undefined') {

//         const token =bearerHeader.split(' ')[1];
//         jwt.verify(token, 'secretkey', function(err, usuario) {
//             if (err) {
//                 return res.status(401).send({
//                     success: false,
//                     message: 'Haga login para continuar'
//                 });
//             } else {

//                 next();
//             }
//         });
//     } else {
//         return res.status(401).send({
//             success: false,
//             message: 'Haga login para continuar'
//         });
//     }
// }

export default app;