import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// This middleware protects routes that require a user to be logged in.
const protect = async (req, res, next) => {
  let token;

  // 1. Read the JWT from the 'jwt' cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      // 2. Verify the token using our JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Find the user in the database using the ID from the token.
      // We exclude the password from the data we attach to the request.
      req.user = await User.findById(decoded.id).select('-password');

      // 4. If the user is found, move on to the next function (the actual controller)
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export { protect };