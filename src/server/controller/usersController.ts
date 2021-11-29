import express from "express";
import chalk from "chalk";
import Debug from "debug";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../database/models/user";
import {
  UserModified,
  UserRegistered,
  UserSchema,
  RecipeModified,
} from "../../interfaces/usersInterfaces";

const debug = Debug("xerrAPI:usersController");

const getUserById = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { id } = req.body;

  try {
    const userData: UserSchema = await User.findById(id);
    debug(
      chalk.bgGray.black(
        `Se ha consultado la información del usuario ${id} ${"(´ ▽ `)b"}`
      )
    );

    res.json(userData);
  } catch {
    const error: any = new Error(`No se ha encontrado al usuario id: ${id}`);
    error.code = 404;
    error.status = 404;
    next(error);
  }
};

const addUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { username, email, password, avatar } = req.body;

  const userRegistered: UserRegistered = await User.findOne({ email });

  if (userRegistered) {
    const error: any = new Error("Email ya registrado.");
    error.code = 401;
    next(error);
  } else {
    try {
      const encryptedPassword = await bcrypt.hash(password, 10);
      const newUser: UserSchema = {
        username,
        email,
        password: encryptedPassword,
        avatar,
        avatarBackup: avatar,
        registrationDate: new Date(),
      };
      await User.create(newUser);
      debug(
        chalk.bgGray.black(
          `Usuario ${username} guardado correctamente ${"(´ ▽ `)b"}`
        )
      );
      res.json({
        Resultado: `Usuario ${username} guardado correctamente.`,
      });
    } catch {
      const error: any = new Error(
        "No se ha podido añadir al usuario solicitado."
      );
      error.code = 400;
      error.status = 400;
      next(error);
    }
  }
};

const userLogin = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { email, password } = req.body;

  const userRegistered: UserRegistered = await User.findOne({ email });

  if (userRegistered) {
    const isPasswordOk: boolean = await bcrypt.compare(
      password,
      userRegistered.password
    );

    if (isPasswordOk) {
      const token = jwt.sign(
        {
          id: userRegistered.id,
          username: userRegistered.username,
          email: userRegistered.email,
        },
        process.env.XERRAPI_HASH,
        {
          expiresIn: process.env.TOKEN_EXP_DATE,
        }
      );
      debug(
        chalk.bgGray.black(
          `Token generado para ${email} correctamente ${"(´ ▽ `)b"}`
        )
      );
      res.json({ token });
    } else {
      const error: any = new Error("Datos incorrectos.");
      error.code = 401;
      next(error);
    }
  } else {
    const error: any = new Error("Datos incorrectos.");
    error.code = 401;
    next(error);
  }
};

const modifyUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const newUserData: UserModified = req.body;

  try {
    const password = await bcrypt.hash(newUserData.password, 10);
    const modifiedUserData = { ...newUserData, password };
    await User.findByIdAndUpdate(newUserData.id, modifiedUserData, {
      new: true,
      select: "username email password avatar",
    });
    debug(
      chalk.bgGray.black(
        `Datos de id:${newUserData.id} modificados correctamente ${"(´ ▽ `)b"}`
      )
    );
    res.json({
      Resultado: `Usuario id:${newUserData.id} modificado correctamente.`,
    });
  } catch {
    const error: any = new Error("Formato de datos incorrectos.");
    error.code = 400;
    error.status = 400;
    next(error);
  }
};

const addRecipe = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const newRecipeData: RecipeModified = req.body;
    const originalRecipesData: UserSchema = await User.findById(
      newRecipeData.id
    );

    if (!newRecipeData.newRecipe) {
      const error: any = new Error(
        "El formato del valor de la receta a añadir es incorrecto."
      );
      error.code = 400;
      error.status = 400;
      next(error);
    } else {
      try {
        originalRecipesData.myRecipes.push(newRecipeData.newRecipe);

        await originalRecipesData.save();

        debug(
          chalk.bgGray.black(
            `Receta añadida al usuario id:${
              newRecipeData.id
            } correctamente ${"(´ ▽ `)b"}`
          )
        );
        res.json({
          Resultado: `Receta añadida al usuario id:${newRecipeData.id} correctamente.`,
        });
      } catch {
        const error: any = new Error(
          "Se ha producido un fallo al añadir la receta al usuario."
        );
        error.code = 400;
        error.status = 400;
        next(error);
      }
    }
  } catch (error) {
    error.message = "Error indeterminado.";
    error.code = 500;
    error.status = 500;
    next(error);
  }
};

const removeRecipe = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const deletedRecipeData: RecipeModified = req.body;
  const originalRecipesData: any = await User.findById(deletedRecipeData.id);

  if (deletedRecipeData.deletedRecipe) {
    if (
      originalRecipesData.myRecipes.includes(deletedRecipeData.deletedRecipe)
    ) {
      try {
        originalRecipesData.myRecipes.remove(deletedRecipeData.deletedRecipe);
        await originalRecipesData.save();
        debug(
          chalk.bgGray.black(
            `Receta borrada al usuario id:${
              deletedRecipeData.id
            } correctamente ${"(´ ▽ `)b"}`
          )
        );
        res.json({
          Resultado: `Receta borrada al usuario id:${deletedRecipeData.id} correctamente.`,
        });
      } catch {
        const error: any = new Error(
          "Se ha producido un fallo al borrar la receta al usuario."
        );
        error.code = 400;
        error.status = 400;
        next(error);
      }
    } else {
      const error: any = new Error(
        `El usuario id: ${deletedRecipeData.id} no tiene receta añadida con id: ${deletedRecipeData.deletedRecipe}`
      );
      error.code = 404;
      next(error);
    }
  } else {
    const error: any = new Error(
      "El formato del valor de la receta a borrar es incorrecto."
    );
    error.code = 400;
    next(error);
  }
};

const addFavorite = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const newFavoriteData: RecipeModified = req.body;
  const originalFavoritesData: UserSchema = await User.findById(
    newFavoriteData.id
  );

  if (newFavoriteData.newFavorite) {
    try {
      originalFavoritesData.myFavorites.push(newFavoriteData.newFavorite);

      await originalFavoritesData.save();

      debug(
        chalk.bgGray.black(
          `Receta añadida a los favoritos del usuario id:${
            newFavoriteData.id
          } correctamente ${"(´ ▽ `)b"}`
        )
      );
      res.json({
        Resultado: `Receta añadida a los favoritos del usuario id:${newFavoriteData.id} correctamente.`,
      });
    } catch {
      const error: any = new Error(
        "Se ha producido un fallo al añadir la receta a los favoritos del usuario."
      );
      error.code = 400;
      error.status = 400;
      next(error);
    }
  } else {
    const error: any = new Error(
      "El formato del valor de la receta a añadir a favoritos es incorrecto."
    );
    error.code = 400;
    next(error);
  }
};

const removeFavorite = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const deletedFavoriteRecipeData: RecipeModified = req.body;
  const originalRecipesData: any = await User.findById(
    deletedFavoriteRecipeData.id
  );
  if (deletedFavoriteRecipeData.deletedFavorite) {
    if (
      originalRecipesData.myFavorites.includes(
        deletedFavoriteRecipeData.deletedFavorite
      )
    ) {
      try {
        originalRecipesData.myFavorites.remove(
          deletedFavoriteRecipeData.deletedFavorite
        );
        await originalRecipesData.save();
        debug(
          chalk.bgGray.black(
            `Receta borrada de favoritos al usuario id:${
              deletedFavoriteRecipeData.id
            } correctamente ${"(´ ▽ `)b"}`
          )
        );
        res.json({
          Resultado: `Receta borrada de favoritos al usuario id:${deletedFavoriteRecipeData.id} correctamente.`,
        });
      } catch {
        const error: any = new Error(
          "Se ha producido un fallo al borrar la receta de favoritos al usuario."
        );
        error.code = 400;
        error.status = 400;
        next(error);
      }
    } else {
      const error: any = new Error(
        `El usuario id: ${deletedFavoriteRecipeData.id} no tiene receta añadida a favoritos con id: ${deletedFavoriteRecipeData.deletedFavorite}`
      );
      error.code = 404;
      next(error);
    }
  } else {
    const error: any = new Error(
      "El formato del valor de la receta a borrar de favoritos es incorrecto."
    );
    error.code = 400;
    next(error);
  }
};

const removeUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { id } = req.body;
  const isIdRegistered: UserSchema = await User.findById(id);

  if (isIdRegistered) {
    try {
      await User.findByIdAndDelete(id);
      debug(
        chalk.bgGray.black(
          `Se ha eliminado correctamente al usuario ${id} ${"(´ ▽ `)b"}`
        )
      );

      res.json({
        resultado: `Se ha eliminado correctamente al usuario ${id}`,
      });
    } catch {
      const error: any = new Error(
        `No se ha podido eliminar al usuario id: ${id}`
      );
      error.code = 500;
      error.status = 500;
      next(error);
    }
  } else {
    const error: any = new Error(`No se ha encontrado al usuario id: ${id}`);
    error.code = 404;
    error.status = 404;
    next(error);
  }
};

export {
  getUserById,
  addUser,
  userLogin,
  modifyUser,
  addRecipe,
  removeRecipe,
  addFavorite,
  removeFavorite,
  removeUser,
};
