const admin = require('../config/fireBase');

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token){
    return res.status(401).json('Unauthorized');
  } 

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (err) {
    return res.status(401).json('Invalid Token');
  }
};

const checkAdmin = (req, res, next) => {
  if (!req.user || !req.user.admin) {
    return res.status(403).json('Admin access required');
  }
  next();
};

module.exports = { authenticate, checkAdmin };