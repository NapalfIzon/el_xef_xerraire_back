import bcrypt from "bcrypt";
import {
  UserSchema,
  UserRegistered,
  RecipeModified,
} from "../interfaces/usersInterfaces";

const userTest: UserSchema = {
  id: "12345",
  username: "test",
  email: "test@test.com",
  password: "$2b$10$C8IeRGecLr60m88.B0JEkOqEdzboyKy0jZeCLHX4jBsOipPNpi7Iq",
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
  password: "test",
  avatar: "/IMG/test.webp",
  myRecipes: ["testMyRecipe"],
  myFavorites: ["testFavoriteRecipe"],
};

const userLoginTest = async () => {
  const userData: UserRegistered = {
    id: "whatever",
    email: "test@test.com",
    password: await bcrypt.hash("test", 10),
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

export {
  userTest,
  newUserTest,
  userLoginTest,
  recipeAndFavoriteTest,
  testUserId,
};
