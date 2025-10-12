import { Usuario } from "../models/Usuario.js";

export async function getAllUser( req, res){
    try{
        const usuarios=await Usuario.findAll({
            attributes:['id','username','email','contrasena','estado'],
        });
        res.json(usuarios);
    }catch(error){
        res.status(500).json({
            message:error.message,
        });
    }
}

export async function createUser(req, res){
    const {nombre, correo, contrasena} = req.body;
    const salt = await bcrypt.genSalt(10);
    try{
        const newUsuario=await Usuario.create({
            username:nombre,
            email:correo,
            contrasena: await bcrypt.hash(contrasena, salt),
            estado:'1',
        },{
            fields:['username','email','contrasena','estado']
        });
        res.status(201).json(newUsuario);
    }catch(error){
        res.status(500).json({
            message:error.message,
        });
    }
}

export async function getUser(req, res){
    const {id}=req.params;
    try{
        const user= await Usuario.findOne({
            where:{id}
        });
        res.status(201).json(user);
    }catch(error){
        res.status(500).json({
            message:error.message,
        });
    }
}

export async function updateUser(req, res){
    const {id}=req.params;
    const {nombre, correo, contrasena, estado} = req.body;
    const salt = await bcrypt.genSalt(10);
    try{
        const user=await Usuario.findByPk(id);
        user.nombre=nombre;
        user.correo=correo;
        user.contrasena=await bcrypt.hash(contrasena, salt);
        user.estado=estado;
        await user.save();
        
        res.status(201).json(user);
    }catch(error){
        res.status(500).json({
            message:error.message,
        });
    }
}

export async function deleteUser(req,res){
    const {id}=req.params;
    try {
        await Producto.destroy({
            where: { usuario_id: id },
          }); 

        await Categoria.destroy({
          where: { usuario_id: id },
        });
        await Usuario.destroy({
          where: { id },
        });
        return res.sendStatus(204);
      } catch (error) {
        res.status(500).json({
          message: error.message,
        });
      }
}