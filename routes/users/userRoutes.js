const express = require('express');
const User = require('../../Models/users');
const router = express.Router();
const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const { Op } = Sequelize;

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      where: { email }
    });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id, email: user.email, username: user.username }, 'mahesh!!12345@12', { expiresIn: '24h' });
    console.log(token);
    res.status(200).json({ token, user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'An error occurred while logging in' });
  }
});


router.post('/create-user', async (req, res) => {
  const { username, email, password } = req.body;

  const existingUser = await User.findOne({
    where: {
      [Op.or]: [{ username: username }, { email: email }]
    }
  });
  if (existingUser) {
    return res.status(400).json({ error: 'Username or email already exists' });
  }
  const userSchema = Joi.object({
    username: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .required()
      .min(8)
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      .error(
        new Error('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.')
      )
  });
  try {
    const { error } = userSchema.validate({ username, email, password });
    if (error) {
      console.log('Error in user create:', error);
      return res.status(400).json({ error: error.message });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword
    });
    res.status(201).json("User created");
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'An error occurred while creating user.' });
  }
});

module.exports = router;
