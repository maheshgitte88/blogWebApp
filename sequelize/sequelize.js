const Sequelize = require('sequelize');

const sequelize = new Sequelize('supermind', 'root', 'YourRootPassword', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;
