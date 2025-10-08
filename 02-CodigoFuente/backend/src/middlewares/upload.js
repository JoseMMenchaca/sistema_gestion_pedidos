import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Obtener __dirname en módulos ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta donde se guardarán las imágenes (fuera de 'src' y 'middlewares')
const uploadDir = path.join(__dirname, "../../uploads"); // La ruta va dos niveles hacia arriba

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Usar la ruta de la carpeta uploads fuera de 'src'
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Nombre único para evitar colisiones
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/; // Tipos de archivos permitidos
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Solo se permiten imágenes (jpeg, jpg, png)"));
    }
  },
});

export default upload;
