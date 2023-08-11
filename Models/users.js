const Sequelize = require('sequelize');
const sequelize = require('../sequelize/sequelize');
const Joi = require('joi');

const User = sequelize.define('user', {

  username: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      validateUsername(value) {
        const schema = Joi.string().min(3).required();
        const { error } = schema.validate(value);
        if (error) {
          throw new Error('Username validation failed');
        }
      }
    }
  },

  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      validateEmail(value) {
        const schema = Joi.string().email().required();
        const { error } = schema.validate(value);
        if (error) {
          throw new Error('Email validation failed');
        }
      }
    }
  },
  
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  }
}, {
  tableName: 'users'
});

module.exports = User;
