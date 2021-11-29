import { RecipesPaths } from "../../interfaces/recipesInterface";

const recipesPath: RecipesPaths = {
  getRecipeById: "/getrecipe",
  getRecipeByWord: "/searchrecipe",
  addRecipe: "/addrecipe",
  uploadVote: "/uploadvote",
  modifyRecipe: "/modifyrecipe",
  removeRecipe: "/removerecipe",
};

export default recipesPath;
