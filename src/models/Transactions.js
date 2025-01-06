const { DataTypes } = require('sequelize');
const { database } = require('../configs');
const Wallets = require('./Wallets');

const Transactions = database.define('transactions', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  wallet_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: false,
  },
  balance: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: false,
  },
  transactions_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  transaction_type: {
    type: DataTypes.ENUM('CREDIT', 'DEBIT'),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'transactions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

Transactions.belongsTo(Wallets, {
  foreignKey: 'id',
  sourceKey: 'wallet_id',
  as: 'wallets',
});

module.exports = Transactions;
