import express from "express";
import chalk from "chalk";
import Debug from "debug";
import Recipe from "../../database/models/recipe";
import { RecipeSchema } from "../../interfaces/recipesInterface";

const debug = Debug("xerrAPI:recipesController");

const getRecipeById = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { id } = req.body;

  try {
    const recipeData: RecipeSchema = await Recipe.findById(id);
    debug(
      chalk.bgGray.black(
        `Se ha consultado la información de la receta ${id} ${"(´ ▽ `)b"}`
      )
    );

    res.json(recipeData);
  } catch {
    const error: any = new Error(`No se ha encontrado la receta id: ${id}`);
    error.code = 404;
    error.status = 404;
    next(error);
  }
};

const searchRecipe = () => {};

const addRecipe = () => {};

const uploadVote = () => {};

const modifyRecipe = () => {};

const removeRecipe = () => {};

export {
  getRecipeById,
  searchRecipe,
  addRecipe,
  uploadVote,
  modifyRecipe,
  removeRecipe,
};
