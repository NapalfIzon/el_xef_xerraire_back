import express from "express";
import usersPath from "../paths/usersPath";
import {
  addUser,
  getUserById,
  userLogin,
  modifyUser,
  removeUser,
  addRecipe,
  removeRecipe,
  addFavorite,
  removeFavorite,
} from "../controller/usersController";

const router = express.Router();

router.post(usersPath.getUserById, getUserById);

router.post(usersPath.addUser, addUser);

router.post(usersPath.userLogin, userLogin);

router.patch(usersPath.modifyUser, modifyUser);

router.delete(usersPath.removeUser, removeUser);

router.patch(usersPath.addRecipe, addRecipe);

router.delete(usersPath.removeRecipe, removeRecipe);

router.patch(usersPath.addFavorite, addFavorite);

router.delete(usersPath.removeFavorite, removeFavorite);

export default router;
