import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';
import { PedidoDetalle } from './PedidoDetalle.js';
export const Pedido = sequelize.define('pedidos', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    monto: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    fecha_pedido: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    metodo_pago: {
        type: DataTypes.ENUM('QR','EFECTIVO','TRANSFERENCIA',),
        
    },
    estado: {
        type: DataTypes.ENUM('PENDIENTE','EN PREPARACIÓN','ENVIADO','ENTREGADO'),
        
    },
       
}, {
    timestamps: true,
    tableName: 'pedidos',
});



 Pedido.hasMany(PedidoDetalle, {
     foreignKey: 'pedido_id',
     targetKey: 'id',
 });

 PedidoDetalle.belongsTo(Pedido, {
       foreignKey: 'pedido_id', 
       targetKey: 'id' 
      });