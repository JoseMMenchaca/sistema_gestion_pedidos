import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

export const Usuario = sequelize.define(
    'usuarios',
    {
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        username:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        email:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        contrasena:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        estado:{
            type:DataTypes.BOOLEAN,
            defaultValue:true
        },
    },
    {
      timestamps: false,
    }
);