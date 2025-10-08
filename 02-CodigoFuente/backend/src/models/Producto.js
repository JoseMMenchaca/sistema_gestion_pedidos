import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';
import { PedidoDetalle } from './PedidoDetalle.js'; 
export const Producto = sequelize.define('productos', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.STRING,
    },
    precio: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    imagen: {
      type: DataTypes.STRING,
      allowNull: true,
    },    
}, {
    timestamps: true,
    tableName: 'productos',
});

 Producto.hasMany(PedidoDetalle, {
     foreignKey: 'producto_id',
     sourceKey: 'id',
 });

 PedidoDetalle.belongsTo(Producto, {
     foreignKey: 'producto_id',
     targetKey: 'id',
 });
