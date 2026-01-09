import mongoose from "mongoose";  //we import mongoose because we are using mongoose to interact with MongoDB

const userSchema = new mongoose.Schema(  //defining the structure of user documents in MongoDB, we create a new schema using mongoose.Schema ,here mongoose.Schema is a constructor that takes an object defining the structure of the documents
  {
    email: {  //defining the email field
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",  // Default value is an empty string if no profile picture is provided
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema); //we create a model named "User" using mongoose.model .This model will be used to interact with the "users" collection in the MongoDB database. here User is the name of the model and collection will be named "users" in the database (Mongoose automatically pluralizes the model name to determine the collection name).
//User converts to users as per mongoose convention.

export default User;