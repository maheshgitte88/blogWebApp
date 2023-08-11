const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization;
  const authToken = token.split(' ')[1]
  if (!authToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const decodedToken = jwt.verify(authToken, 'mahesh!!12345@12');
    req.user = { id: decodedToken.userId };
    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    return res.status(401).json({ error: 'Unauthorized' });
  }

};

module.exports = { authenticateUser };
