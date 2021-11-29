import express from "express";
import auth from "../middlewares/auth";
import recipesPath from "../paths/recipesPath";
import {
  getRecipe,
  searchRecipe,
  addRecipe,
  uploadVote,
  modifyRecipe,
  removeRecipe,
} from "../controller/recipesController";

const router = express.Router();

router.post(recipesPath.getRecipeById, getRecipe);

router.post(recipesPath.getRecipeByWord, auth, searchRecipe);

router.post(recipesPath.addRecipe, auth, addRecipe);

router.patch(recipesPath.uploadVote, auth, uploadVote);

router.patch(recipesPath.modifyRecipe, auth, modifyRecipe);

router.delete(recipesPath.removeRecipe, auth, removeRecipe);

export default router;