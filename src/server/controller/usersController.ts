import express from "express";
import chalk from "chalk";
import Debug from "debug";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../database/models/user";
import {
  NewUser,
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
  const { id } = req.params;

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
  const userData = req.body;

  const userRegistered: UserRegistered = await User.findOne(userData.email);

  if (userRegistered) {
    const error: any = new Error("Email ya registrado.");
    error.code = 401;
    next(error);
  } else {
    try {
      const password = await bcrypt.hash(userData.password, 10);
      const newUser: NewUser = {
        username: userData.username,
        email: userData.email,
        password,
        avatar: userData.avatar,
        avatarBackup: userData.avatar,
        registrationDate: new Date(),
      };
      await User.create(newUser);
      debug(
        chalk.bgGray.black(
          `Usuario ${userData.username} guardado correctamente ${"(´ ▽ `)b"}`
        )
      );
      res.json({
        Resultado: `Usuario ${userData.username} guardado correctamente.`,
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
    const isPasswordOk: Boolean = await bcrypt.compare(
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
    next(error);
  }
};

const addRecipe = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const newRecipeData: RecipeModified = req.body;
  const originalRecipesData: UserSchema = await User.findById(newRecipeData.id);

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
    next(error);
  }
};

const removeRecipe = () => {};

const addFavorite = () => {};

const removeFavorite = () => {};

const removeUser = () => {};

export {
  getUserById,
  addUser,
  userLogin,
  modifyUser,
  removeUser,
  addRecipe,
  removeRecipe,
  addFavorite,
  removeFavorite,
};
