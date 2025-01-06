const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  host: process.env.HOST, 
  username:  process.env.USER_NAME, 
  password:  process.env.PASSWORD,
  database:  process.env.DATABASE,
  dialect: 'mysql',
  port:  process.env.DATABASE_PORT,
  logging: false,
});

module.exports = sequelize;
