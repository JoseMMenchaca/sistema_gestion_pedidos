import { Cliente } from "../models/Cliente.js";
import { Pedido } from "../models/Pedido.js";

export const listarClientes = async (req, res) => {
    try{
        const clientes = await Cliente.findAll()
        res.status(200).json(clientes);
    }
    catch(error){
        return res.status(500).json({message: error.message});
   }   
}

export const crearCliente = async (req, res) => {
    try{
        const { nombre,
            direccion,
            celular,
            email,
            estado} = req.body
    
        const crearCliente = await Cliente.create({
            nombre,
            direccion,
            celular,
            email,
            estado
        });
        res.status(201).json({
            ok: true,
            status: 201,
            message: "Cliente Regitrado",
        });
    }
    catch(error){
        return res.status(500).json({message: error.message});
   }
}

export const actualizarCliente = async (req, res) => {
    const {id} = req.params
    try{
        const cliente = await Cliente.findOne({
            where: {id},
        });
        cliente.set(req.body);
        await cliente.save();
        
        res.status(200).json({
            message: "Registro Actualizado",
            ok: true,
            status: 200,
            body: cliente,
        });
    }
    catch(error){
        return res.status(500).json({message: error.message});
    }
};

export const verCliente = async (req, res) => {
    const {id} = req.params
       try{
           const cliente = await Cliente.findOne({
               where: {id},
           });
           res.status(200).json( cliente);
       }
       catch(error){
            return res.status(500).json({message: error.message});
       }
}

export const verClientePedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.findAll({ where: { cliente_id: req.params.id } });
        res.status(200).json(pedidos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};