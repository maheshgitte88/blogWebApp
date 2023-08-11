const express = require('express');
const sequelize = require('./sequelize/sequelize');
const cors = require('cors');
const userRoutes =require('./routes/users/userRoutes')
const commentRoutes =require('./routes/comments/commentRoutes')
const postRoutes =require('./routes/posts/postRoutes')
const PORT = 7000;
const app = express();
app.use(cors());
app.use(express.json());


sequelize.sync()
  .then(() => {
    console.log('Database synced');
  })
  .catch(error => {
    console.error('Error syncing database:', error.message);
    console.error('Full error:', error);
  });

  
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/posts', postRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
