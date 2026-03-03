import jwt from "jsonwebtoken";  //here import jwt from jsonwebtoken represents the jsonwebtoken package is being imported and assigned to the variable jwt, allowing you to use its functionality in your code.

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const isDevelopment = process.env.NODE_ENV === "development";

  res.cookie("jwt", token, {  //jwt is the name of the cookie where the token will be stored,token stored in the cookie and cookie is sent back to the client in the response
    maxAge: 7 * 24 * 60 * 60 * 1000, // MS
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    sameSite: isDevelopment ? "lax" : "none", // lax for local development (HTTP), none for production (HTTPS)
    secure: !isDevelopment, // false for localhost (HTTP), true for HTTPS
    path: "/", // explicitly set path
  });

  return token;
};