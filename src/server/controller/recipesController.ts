import express from "express";
import chalk from "chalk";
import Debug from "debug";
import Recipe from "../../database/models/recipe";
import User from "../../database/models/user";
import { RecipeSchema } from "../../interfaces/recipesInterface";
import categories from "../../utils/categories";

const debug = Debug("xerrAPI:recipesController");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const populateRandom = User;

const getRecipes = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const recipesData: Array<object> = await Recipe.find().limit(8).populate({
      path: "owner",
      select: "id avatar",
    });
    debug(
      chalk.bgGray.black(
        `Se ha generado una lista de recetas correctamente ${"(´ ▽ `)b"}`
      )
    );

    res.json(recipesData);
  } catch {
    const error: any = new Error(`No se han encontrado recetas (BB.DD vacía)`);
    error.code = 404;
    error.status = 404;
    next(error);
  }
};

const getRandomRecipes = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const randomCategory = categories[Math.floor(Math.random() * 22)];

  try {
    const randomRecipesData: object = await Recipe.findOne({
      category: randomCategory,
    });

    debug(
      chalk.bgGray.black(
        `Se ha generado una receta random correctamente ${"(´ ▽ `)b"}`
      )
    );

    res.json(randomRecipesData);
  } catch {
    const error: any = new Error(
      `No se han encontrado recetas random (BB.DD vacía)`
    );
    error.code = 404;
    error.status = 404;
    next(error);
  }
};

const getRecipe = async (
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

const searchRecipe = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { searchValue } = req.body;

  try {
    if (searchValue === undefined || searchValue.length === 0) {
      const error: any = new Error(
        "El formato de la palabra a buscar no es el correcto."
      );
      error.code = 400;
      error.status = 400;
      next(error);
    } else {
      const recipesData = await Recipe.find({
        $or: [
          {
            title: {
              $regex: searchValue,
              $options: "i",
            },
          },
          {
            category: {
              $regex: searchValue,
              $options: "i",
            },
          },
        ],
      });

      debug(
        chalk.bgGray.black(
          `Se han buscado recetas relaciondas con el término '${searchValue}' ${"(´ ▽ `)b"}`
        )
      );

      res.json(recipesData);
    }
  } catch {
    const error: any = new Error(
      "El formato de la petición no es el correcto."
    );
    error.code = 404;
    error.status = 404;
    next(error);
  }
};

const addRecipe = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const {
    title,
    description,
    category,
    ingredients,
    tools,
    steps,
    image,
    owner,
  }: RecipeSchema = req.body;

  try {
    const newRecipe: RecipeSchema = {
      title,
      description,
      category,
      ingredients,
      tools,
      steps,
      image,
      imageBackup: image,
      valoration: 3,
      quantityValorations: 3,
      owner,
    };

    await Recipe.create(newRecipe);

    debug(
      chalk.bgGray.black(
        `Receta '${title}'' creada correctamente ${"(´ ▽ `)b"}`
      )
    );
    res.json({
      Resultado: `Receta '${title}'' creada correctamente.`,
    });
  } catch {
    const error: any = new Error("No se ha podido crear la receta.");
    error.code = 400;
    error.status = 400;
    next(error);
  }
};

const uploadVote = () => {};

const modifyRecipe = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { recipe } = req.body;
  const { id } = recipe;
  const isIdStored: RecipeSchema = await Recipe.findById(id);

  if (isIdStored) {
    try {
      await Recipe.findByIdAndUpdate(id, recipe);
      debug(
        chalk.bgGray.black(
          `Se ha modificado correctamente la receta ${id} ${"(´ ▽ `)b"}`
        )
      );

      res.status(202).json({
        resultado: `Se ha modificado correctamente la receta ${id}`,
      });
    } catch {
      const error: any = new Error(
        `No se ha podido modificar la receta id: ${id}`
      );
      error.code = 500;
      error.status = 500;
      next(error);
    }
  } else {
    const error: any = new Error(`No se ha encontrado la receta id: ${id}`);
    error.code = 404;
    error.status = 404;
    next(error);
  }
};

const removeRecipe = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { recipeId } = req.body;
  const id = recipeId;
  const isIdStored: RecipeSchema = await Recipe.findById(id);

  if (isIdStored) {
    try {
      await Recipe.findByIdAndDelete(id);
      debug(
        chalk.bgGray.black(
          `Se ha eliminado correctamente la receta ${id} ${"(´ ▽ `)b"}`
        )
      );

      res.json({
        resultado: `Se ha eliminado correctamente la receta ${id}`,
      });
    } catch {
      const error: any = new Error(
        `No se ha podido eliminar la receta id: ${id}`
      );
      error.code = 500;
      error.status = 500;
      next(error);
    }
  } else {
    const error: any = new Error(`No se ha encontrado la receta id: ${id}`);
    error.code = 404;
    error.status = 404;
    next(error);
  }
};

export {
  getRecipes,
  getRandomRecipes,
  getRecipe,
  searchRecipe,
  addRecipe,
  uploadVote,
  modifyRecipe,
  removeRecipe,
};
