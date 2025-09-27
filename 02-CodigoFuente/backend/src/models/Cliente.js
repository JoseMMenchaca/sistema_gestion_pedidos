import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';
import { Pedido } from './Pedido.js';

export const Cliente = sequelize.define('clientes', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    celular: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    timestamps: true,
    tableName: 'clientes',
});

Cliente.hasMany(Pedido, {
     foreignKey: 'cliente_id', 
     sourceKey: 'id' 
    });
Pedido.belongsTo(Cliente, {
     foreignKey: 'cliente_id', 
     targetKey: 'id' 
    });
