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
import auth from "../middlewares/auth";

const router = express.Router();

router.post(usersPath.getUserById, auth, getUserById);

router.post(usersPath.addUser, addUser);

router.post(usersPath.userLogin, userLogin);

router.patch(usersPath.modifyUser, auth, modifyUser);

router.delete(usersPath.removeUser, auth, removeUser);

router.patch(usersPath.addRecipe, auth, addRecipe);

router.delete(usersPath.removeRecipe, auth, removeRecipe);

router.patch(usersPath.addFavorite, auth, addFavorite);

router.delete(usersPath.removeFavorite, auth, removeFavorite);

export default router;
