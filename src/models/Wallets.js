const { DataTypes } = require('sequelize');
const { database } = require('../configs');
const Users = require('./Users');

const Wallets = database.define('wallets', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  balance: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'wallets',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

Wallets.hasOne(Users, {
  foreignKey: 'id',
  sourceKey: 'user_id',
  as: 'users',
});

module.exports = Wallets;
