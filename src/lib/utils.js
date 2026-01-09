import jwt from "jsonwebtoken";  //here import jwt from jsonwebtoken represents the jsonwebtoken package is being imported and assigned to the variable jwt, allowing you to use its functionality in your code.

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {  //jwt is the name of the cookie where the token will be stored,token stored in the cookie and cookie is sent back to the client in the response
    maxAge: 7 * 24 * 60 * 60 * 1000, // MS
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    sameSite: "strict", // CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};