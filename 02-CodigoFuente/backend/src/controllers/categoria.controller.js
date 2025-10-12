import { Categoria } from "../models/Categoria.js";

export async function listarCategorias( req, res){
    try{
        const categorias=await Categoria.findAll();
        res.json(categorias);
    }catch(error){
        res.status(500).json({
            message:error.message,
        });
    }
}

export async function crearCategoria(req, res){
    const {nombre,descripcion} = req.body;
    try{
        const newCategoria=await Categoria.create({
            nombre,
            descripcion,
            
        },{
            fields:['nombre','descripcion']
        });
        res.status(201).json(newCategoria);
    }catch(error){
        res.status(500).json({
            message:error.message,
        });
    }
}

export async function verCategoria(req, res){
    const {id}=req.params;
    try{
        const categoria= await Categoria.findOne({
            where:{id}
        });
        res.status(200).json(categoria);
    }catch(error){
        res.status(500).json({
            message:error.message,
        });
    }
}

export async function actualizarCategoria(req, res){
    const {id}=req.params;
    const {nombre, descripcion} = req.body;

    try{
        const categoria=await Categoria.findByPk(id);
        categoria.nombre=nombre;
        categoria.descripcion=descripcion;

        await categoria.save();
        
        res.status(201).json(categoria);
    }catch(error){
        res.status(500).json({
            message:error.message,
        });
    }
}