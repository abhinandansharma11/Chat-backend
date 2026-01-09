import User from "../models/user.model.js";
import Message from "../models/message.model.js";

import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;  // Get the logged-in user's ID from the request object assigned by the protectRoute middleware
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");  // Exclude the logged-in user and omit the password field (because we only need other user details for the sidebar)

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [  // Find messages where either the sender or receiver matches the current user and the other user
        { senderId: myId, receiverId: userToChatId },  // Messages sent by me to the user I'm chatting with
        { senderId: userToChatId, receiverId: myId },  // Messages sent by the user I'm chatting with to me
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);  //upload image to cloudinary and get the uploaded image url
      imageUrl = uploadResponse.secure_url; //here we are using secure_url to get the https url of the uploaded image
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save(); // Save the new message to the database

    // Emit the new message to the receiver via Socket.io and send real-time notification
    
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};