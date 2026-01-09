import dotenv from 'dotenv';  // Import dotenv to manage environment variables
dotenv.config(); // Load environment variables from .env file

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';


import { connectDB } from './lib/db.js';

import authRoutes from './routes/auth.route.js'; 
import messageRoutes from './routes/message.route.js';

import { app, server } from "./lib/socket.js";






app.use(express.json({ limit: "10mb" })); // Middleware to parse JSON request bodies
app.use(cookieParser()); // Middleware to parse cookies,this is needed to read the jwt token from cookies as we are storing the jwt token in cookies
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from this origin
  credentials: true, // Enable sending cookies with requests
}));


app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

const PORT = process.env.PORT;  
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB(); // Connect to the database when the server starts
});