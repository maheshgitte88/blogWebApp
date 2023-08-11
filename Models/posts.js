const Sequelize = require('sequelize');
const sequelize = require('../sequelize/sequelize');
const Joi = require('joi');
const User = require('./users');

const Post = sequelize.define('post', {
  
  title: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      validateTitle(value) {
        const schema = Joi.string().min(3).required();
        const { error } = schema.validate(value);
        if (error) {
          throw new Error('Title validation failed');
        }
      }
    }
  },

  content: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      validateContent(value) {
        const schema = Joi.string().min(250).required();
        const { error } = schema.validate(value);
        if (error) {
          throw new Error('Content validation failed Blog not less than 250 char');
        }
      }
    }
  }
}, {
  tableName: 'posts'
});

Post.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Post, { foreignKey: 'userId' });

module.exports = Post;
