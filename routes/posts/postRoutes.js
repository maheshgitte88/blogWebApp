const express = require('express');
const Post = require('../../Models/posts')
const User = require('../../Models/users')
const Comment = require('../../Models/comments')
const router = express.Router();
const { authenticateUser } = require('../../authenticateUser');
const Sequelize = require('sequelize');

router.post('/create-blog', authenticateUser, async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;
  if (!userId) {
    return res.status(401).json({ error: 'User is missing. Please log in.' });
  }
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (content.length < 250) {
      return res.status(400).json({ error: 'Blog content should be at least 250 characters.' });
    }
    const post = await Post.create({ userId, title, content });
    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'An error occurred while creating post.' });
  }
});

router.get('/user-blogs', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const userBlogs = await Post.findAll({
      where: { userId: userId },
    });
    res.status(200).json(userBlogs);
  } catch (error) {
    console.error('Error fetching user blogs:', error);
    res.status(500).json({ error: 'An error occurred while fetching user blogs.' });
  }
});

router.get('/blog/:postId', async (req, res) => {
  const postId = req.params.postId;
  console.log(postId, 'api hits')
  try {
    const post = await Post.findByPk(postId, {
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'email']
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ['id', 'username']
            }
          ]
        }
      ]
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ error: 'An error occurred while fetching blog post.' });
  }
});


router.get('/search-blogs/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const userBlogs = await Post.findAll({
      where: {
        [Sequelize.Op.or]: [
          { '$user.username$': { [Sequelize.Op.like]: `%${query}%` } },
          { title: { [Sequelize.Op.like]: `%${query}%` } }
        ]
      },
      include: [{ model: User, as: 'user', attributes: ['username'] }],
      attributes: ['title', 'content', 'id', 'createdAt']
    });

    res.status(200).json(userBlogs);
  } catch (error) {
    console.error('Error searching for blogs:', error);
    res.status(500).json({ error: 'An error occurred while searching for blogs.' });
  }
});

router.delete('/delete-blog/:id', authenticateUser, async (req, res) => {
  const blogId = req.params.id;

  try {
    const blog = await Post.findOne({ where: { id: blogId, userId: req.user.id } });
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found or unauthorized' });
    }

    await blog.destroy();
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ error: 'An error occurred while deleting the blog' });
  }
});


router.put('/edit-blog/:id', authenticateUser, async (req, res) => {
  const blogId = req.params.id;
  const { title, content } = req.body;
  try {
    const blog = await Post.findOne({ where: { id: blogId, userId: req.user.id } });
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found or unauthorized' });
    }

    blog.title = title;
    blog.content = content;
    await blog.save();
    res.status(200).json({ message: 'Blog updated successfully' });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ error: 'An error occurred while updating the blog' });
  }
});


router.get('/all-blogs', async (req, res) => {
  try {
    const allBlogs = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'email']
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ['id', 'username']
            }
          ]
        }
      ]
    });
    res.status(200).json(allBlogs);
  } catch (error) {
    console.error('Error fetching all blogs:', error);
    res.status(500).json({ error: 'An error occurred while fetching all blogs.' });
  }
});


module.exports = router;