const Sequelize = require('sequelize');
const sequelize = require('../sequelize/sequelize');
const User = require('./users');
const Post = require('./posts');

const Comment = sequelize.define('comment', {
  
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      validateContent(value) {
        if (!value || value.trim().length === 0) {
          throw new Error('Content must not be empty');
        }
      }
    }
  }
}, {
  tableName: 'comments'
});

Comment.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Comment, { foreignKey: 'userId' });

Comment.belongsTo(Post, { foreignKey: 'postId' });
Post.hasMany(Comment, { foreignKey: 'postId' });

module.exports = Comment;
