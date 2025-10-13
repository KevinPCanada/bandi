// This file contains a helper function to generate a JSON Web Token (JWT).
// Keeping this separate makes our controller cleaner and the function reusable.
// ----------------------------------------------------------------

import jwt from 'jsonwebtoken';

// Generate a JWT and set it as a secure, httpOnly cookie.
const generateToken = (res, userId) => {
  // Create the token. 
  // The payload (the first argument) is a simple object containing just the user's ID.
  // This is the data that will be stored inside the token.
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d', // The token will expire in 30 days
  });

  // Set the generated token as a secure cookie on the response object.
  res.cookie('jwt', token, {
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
    sameSite: 'none', // `sameSite: 'none'` is the crucial setting that tells the browser it's safe to send this cookie from frontend domain to backend domain. This requires the `secure: true` attribute to also be set, which the code already does in production.
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  });
};

export default generateToken;