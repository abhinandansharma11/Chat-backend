import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,  // here mongoose.Schema.Types.ObjectId is used to define a field that will store an ObjectId, which is a unique identifier for documents in MongoDB.
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,  // Specify the type as ObjectId to reference another document in MongoDB
      ref: "User",  // Reference to the User model to establish a relationship between messages and users
      required: true,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;