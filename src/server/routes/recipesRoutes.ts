import express from "express";
import auth from "../middlewares/auth";
import recipesPath from "../paths/recipesPath";
import {
  getRecipes,
  getRandomRecipes,
  getRecipe,
  searchRecipe,
  addRecipe,
  uploadVote,
  modifyRecipe,
  removeRecipe,
} from "../controller/recipesController";

const router = express.Router();

router.get(recipesPath.getRecipes, getRecipes);

router.get(recipesPath.getRandomRecipes, getRandomRecipes);

router.post(recipesPath.getRecipe, getRecipe);

router.post(recipesPath.getRecipeByWord, auth, searchRecipe);

router.post(recipesPath.addRecipe, auth, addRecipe);

router.patch(recipesPath.uploadVote, auth, uploadVote);

router.put(recipesPath.modifyRecipe, auth, modifyRecipe);

router.delete(recipesPath.removeRecipe, auth, removeRecipe);

export default router;
