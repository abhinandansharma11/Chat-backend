import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; // Read the token from cookies,this requires cookie-parser middleware to be used in the express app.this parsers the middleware that parses cookies attached to the client request object and makes them accessible via req.cookies

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify the token by checking its signature and expiration,this is done by signing the token with the same secret key that was used to create it.

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password");  // Exclude password field and add user data to req object for further use in the request lifecycle,here decoded contains the payload data of the token, including the userId.

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; //create a user property on req object and assign the user data to it

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};