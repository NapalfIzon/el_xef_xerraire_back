import { Schema, model, Types } from "mongoose";
import { UserSchema } from "../../interfaces/usersInterfaces";

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
  avatarBackup: {
    type: String,
    required: true,
  },
  registrationDate: {
    type: Date,
    required: true,
  },
  myRecipes: {
    type: [Types.ObjectId],
    ref: "Recipe",
    required: false,
  },
  myFavorites: {
    type: [Types.ObjectId],
    ref: "Favorite",
    required: false,
  },
});

const User = model<UserSchema>("User", userSchema, "users");

export default User;
