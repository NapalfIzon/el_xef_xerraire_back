import { Schema, model, Types } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  registrationDate: {
    type: Date,
    required: true,
  },
  myRecipes: {
    type: [Types.ObjectId],
    required: false,
  },
  myFavorites: {
    type: [Types.ObjectId],
    required: false,
  },
});

const User = model("User", userSchema, "users");

export default User;
