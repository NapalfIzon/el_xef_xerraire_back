import dotenv from "dotenv";
import bcrypt from "bcrypt";
import {
  UserSchema,
  UserRegistered,
  RecipeModified,
} from "../interfaces/usersInterface";
import { AuthType } from "../interfaces/authInterface";

dotenv.config();

const userTest: UserSchema = {
  id: "12345",
  username: "test",
  email: "test@test.com",
  password: process.env.RANDOM_PASSWORD_1,
  avatar: "/IMG/test.webp",
  avatarBackup: "/IMG/test.webp",
  registrationDate: new Date("2021-11-27T15:19:05.521Z"),
  myRecipes: ["testMyRecipe"],
  myFavorites: ["testFavoriteRecipe"],
};

const newUserTest: UserSchema = {
  id: "12345",
  username: "test",
  email: "test@test.com",
  password: process.env.RANDOM_PASSWORD_2,
  avatar: "/IMG/test.webp",
  myRecipes: ["testMyRecipe"],
  myFavorites: ["testFavoriteRecipe"],
};

const userLoginTest = async () => {
  const userData: UserRegistered = {
    id: "12345",
    email: "test@test.com",
    password: await bcrypt.hash(process.env.RANDOM_PASSWORD_2, 10),
  };

  return userData;
};

const recipeAndFavoriteTest: RecipeModified = {
  id: "12345",
  newRecipe: "testMyRecipe",
  newFavorite: "testFavoriteRecipe",
  deletedRecipe: "testMyRecipe",
  deletedFavorite: "testFavoriteRecipe",
};

const testUserId: object = {
  id: "12345",
};

const authorizationHeaderRequestKo: AuthType = {
  Authorization: "random",
};

const authorizationHeaderRequestOk: AuthType = {
  Authorization:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3RJZCJ9.b6HmQLN46F-SRnxFOmp1HmFMF2zp_HuPHcJEFeccD_c",
};

export {
  userTest,
  newUserTest,
  userLoginTest,
  recipeAndFavoriteTest,
  testUserId,
  authorizationHeaderRequestKo,
  authorizationHeaderRequestOk,
};
