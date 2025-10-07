import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';
export const PedidoDetalle = sequelize.define('pedido_detalle', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    precio_unitario: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    notas_adicionales: {
        type: DataTypes.STRING,
        defaultValue: true,
    },
       
}, {
    timestamps: true,
    tableName: 'pedido_detalle',
});

