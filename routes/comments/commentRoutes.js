const express = require('express');
const Comment = require('../../Models/comments');
const User = require('../../Models/users');
const Post = require('../../Models/posts');
const router = express.Router();

router.post('/create-comment', async (req, res) => {
  const { userId, postId, content } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const comment = await Comment.create({ userId, postId, content });
    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'An error occurred while creating comment.' });
  }
});


module.exports = router;
