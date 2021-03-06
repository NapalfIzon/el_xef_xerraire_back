import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../database/models/user";
import {
  userTest,
  newUserTest,
  userLoginTest,
  recipeAndFavoriteTest,
  testUserId,
} from "../../mocks/mockedVariables";
import { mockedRequest, mockedResponse } from "../../mocks/mockedFunctions";
import {
  addFavorite,
  addRecipe,
  addUser,
  getUserById,
  modifyUser,
  removeFavorite,
  removeRecipe,
  removeUser,
  userLogin,
} from "./usersController";

jest.mock("../../database/models/user");

describe("Given a getUserById controller,", () => {
  describe("When it receices a request with an inexistent user id in the params,", () => {
    test("Then it should invoke next function with an error message.", async () => {
      const req = mockedRequest();
      req.body = { ...testUserId };
      User.findById = jest.fn().mockRejectedValue("random error");
      const next = jest.fn();

      await getUserById(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty("code");
      expect(next.mock.calls[0][0].code).toBe(404);
    });
  });

  describe("When it receives a request with an user id in the params,", () => {
    test("Then it should invoke res.json with the data of the user.", async () => {
      const req = mockedRequest();
      req.body = { ...testUserId };
      User.findById = jest.fn().mockResolvedValue(userTest);
      const res = mockedResponse();

      await getUserById(req, res, null);

      expect(res.json).toHaveBeenCalledWith(userTest);
    });
  });
});

describe("Given an addUser controller,", () => {
  describe("When it receives new user data with an existing email,", () => {
    test("Then it should next funtion with an error message.", async () => {
      const req = mockedRequest();
      req.body = newUserTest;
      const next = jest.fn();
      User.findOne = jest.fn().mockResolvedValue(true);

      await addUser(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty("message");
      expect(next.mock.calls[0][0].message).toBe("Email ya registrado.");
    });
  });

  describe("When it receives new incomplete user data,", () => {
    test("Then it should invoke next funtion with an error message.", async () => {
      const req = mockedRequest();
      req.body = newUserTest;
      const next = jest.fn();
      User.findOne = jest.fn().mockResolvedValue(false);
      User.create = jest.fn().mockRejectedValue("random error");

      await addUser(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty("message");
      expect(next.mock.calls[0][0].message).toBe(
        "No se ha podido a??adir al usuario solicitado."
      );
    });
  });

  describe("When it receives new user data,", () => {
    test("Then it should invoke res.json informing the user was added correctly.", async () => {
      const req = mockedRequest();
      req.body = newUserTest;
      const res = mockedResponse();
      User.findOne = jest.fn().mockResolvedValue(false);
      User.create = jest.fn().mockResolvedValue(newUserTest);
      const resText = {
        Resultado: `Usuario ${newUserTest.username} guardado correctamente.`,
      };

      await addUser(req, res, null);

      expect(res.json).toHaveBeenCalledWith(resText);
    });
  });
});

describe("Given an userLogin controller,", () => {
  describe("When it receives a non registered email,", () => {
    test("Then it should invoke next function with an error message.", async () => {
      const req = mockedRequest();
      const testingUser = userLoginTest();
      req.body = testingUser;
      const next = jest.fn();
      User.findOne = jest.fn().mockResolvedValue(false);

      await userLogin(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty("message");
      expect(next.mock.calls[0][0].message).toBe("Datos incorrectos.");
    });
  });

  describe("When it receives a registered email and an incorrect password,", () => {
    test("Then it should invoke next function with an error message.", async () => {
      const req = mockedRequest();
      const testingUser = userLoginTest();
      req.body = testingUser;
      const next = jest.fn();
      User.findOne = jest.fn().mockResolvedValue(true);
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      await userLogin(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty("message");
      expect(next.mock.calls[0][0].message).toBe("Datos incorrectos.");
    });
  });

  describe("When it receives a registered email and password,", () => {
    test("The it should invoke res.json with a generated token.", async () => {
      const req = mockedRequest();
      const testingUser = userLoginTest();
      req.body = testingUser;
      const res = mockedResponse();
      const testingToken = { token: "generate.tested.token" };
      User.findOne = jest.fn().mockResolvedValue(testingUser);
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockReturnValue(testingToken.token);

      await userLogin(req, res, null);

      expect(res.json).toHaveBeenCalledWith(testingToken);
    });
  });
});

describe("Given a modifyUser controller,", () => {
  describe("When it receives a non existent id user,", () => {
    test("Then it should invoke next function with an error message.", async () => {
      const req = mockedRequest();
      req.body = newUserTest;
      const next = jest.fn();
      User.findByIdAndUpdate = jest.fn().mockRejectedValue("random error");

      await modifyUser(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty("message");
      expect(next.mock.calls[0][0].message).toBe(
        "Formato de datos incorrectos."
      );
    });
  });

  describe("When it receives a registered id with modified username and email,", () => {
    test("Then it should invoke res.json confirming the modifications was maden correctly.", async () => {
      const req = mockedRequest();
      req.body = newUserTest;
      const res = mockedResponse();
      const resText = {
        Resultado: `Usuario id:${newUserTest.id} modificado correctamente.`,
      };
      User.findByIdAndUpdate = jest.fn().mockResolvedValue(newUserTest);

      await modifyUser(req, res, null);

      expect(res.json).toHaveBeenCalledWith(resText);
    });
  });
});

describe("Given an addRecipe controller,", () => {
  describe("When it receives an incorrect newRecipe format", () => {
    test("Then it should invoke next function with an error message.", async () => {
      const req = mockedRequest();
      const addedRecipeInfo = { ...recipeAndFavoriteTest };
      req.body = addedRecipeInfo;
      delete req.body.newRecipe;
      const next = jest.fn();
      const errorProperty = "message";
      const errorMessage =
        "El formato del valor de la receta a a??adir es incorrecto.";

      await addRecipe(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(errorProperty);
      expect(next.mock.calls[0][0].message).toBe(errorMessage);
    });
  });

  describe("When it receives an incorrect recipe id", () => {
    test("Then it should invoke next function with an error message.", async () => {
      const req = mockedRequest();
      req.body = recipeAndFavoriteTest;
      const next = jest.fn();
      User.findById = jest.fn().mockResolvedValue(userTest);
      userTest.save = jest.fn().mockRejectedValue("random error");

      await addRecipe(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty("message");
      expect(next.mock.calls[0][0].message).toBe(
        "Se ha producido un fallo al a??adir la receta al usuario."
      );
    });
  });

  describe("When it receives an registered id and a recipe id", () => {
    test("Then it should invoke res.json confirming the recipe id was added correctly to the logued user.", async () => {
      const req = mockedRequest();
      req.body = recipeAndFavoriteTest;
      const res = mockedResponse();
      const resText = {
        Resultado: `Receta a??adida al usuario id:${recipeAndFavoriteTest.id} correctamente.`,
      };
      User.findById = jest.fn().mockReturnValue(userTest);
      userTest.save = jest.fn().mockResolvedValue(true);

      await addRecipe(req, res, null);

      expect(res.json).toHaveBeenCalledWith(resText);
    });
  });
});

describe("Given a removeRecipe controller,", () => {
  describe("When it receives an incorrect deletedRecipe format,", () => {
    test("Then it should invoke next function with an error message.", async () => {
      const req = mockedRequest();
      const deletedRecipeInfo = { ...recipeAndFavoriteTest };
      req.body = deletedRecipeInfo;
      delete req.body.deletedRecipe;
      const next = jest.fn();

      await removeRecipe(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty("message");
      expect(next.mock.calls[0][0].message).toBe(
        "El formato del valor de la receta a borrar es incorrecto."
      );
    });
  });

  describe("When it receives an non registered recipe id in myRecipes list,", () => {
    test("Then it should invoke next function with an error message.", async () => {
      const req = mockedRequest();
      const deletedRecipeInfo = { ...recipeAndFavoriteTest };
      deletedRecipeInfo.deletedRecipe = "randomRecipeId";
      req.body = deletedRecipeInfo;
      const errorProperty = "message";
      const errorMessage = `El usuario id: ${deletedRecipeInfo.id} no tiene receta a??adida con id: ${deletedRecipeInfo.deletedRecipe}`;
      const next = jest.fn();
      User.findById = jest.fn().mockReturnValue(userTest);

      await removeRecipe(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(errorProperty);
      expect(next.mock.calls[0][0].message).toBe(errorMessage);
    });
  });

  describe("When it receives a recipe id in myRecipes list but it can't be removed,", () => {
    test("Then it should invoke next function with an error message.", async () => {
      const req = mockedRequest();
      const deletedRecipeInfo = { ...recipeAndFavoriteTest };
      req.body = deletedRecipeInfo;
      const errorProperty = "message";
      const errorMessage =
        "Se ha producido un fallo al borrar la receta al usuario.";
      const next = jest.fn();
      User.findById = jest.fn().mockReturnValue(userTest);
      userTest.save = jest.fn().mockRejectedValue("random error");

      await removeRecipe(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(errorProperty);
      expect(next.mock.calls[0][0].message).toBe(errorMessage);
    });
  });

  describe("When it receives a recipe id equal to a recipe id in myRecipes list of the user,", () => {
    test("Then it should invoke res.json with a confirmation message.", async () => {
      const req = mockedRequest();
      req.body = recipeAndFavoriteTest;
      const res = mockedResponse();
      const resText = {
        Resultado: `Receta borrada al usuario id:${recipeAndFavoriteTest.id} correctamente.`,
      };
      User.findById = jest.fn().mockReturnValue(userTest);
      userTest.myRecipes.remove = jest.fn().mockResolvedValue("randomRecipeId");
      userTest.save = jest.fn().mockResolvedValue(true);

      await removeRecipe(req, res, null);

      expect(res.json).toHaveBeenCalledWith(resText);
    });
  });
});

describe("Given an addFavorite controller,", () => {
  describe("When it receives an incorrect newFavorite format,", () => {
    test("Then it should invoke next function with an error message.", async () => {
      const req = mockedRequest();
      const addedFavoriteRecipeInfo = { ...recipeAndFavoriteTest };
      req.body = addedFavoriteRecipeInfo;
      delete req.body.newFavorite;
      const next = jest.fn();
      const errorProperty = "message";
      const errorMessage =
        "El formato del valor de la receta a a??adir a favoritos es incorrecto.";

      await addFavorite(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(errorProperty);
      expect(next.mock.calls[0][0].message).toBe(errorMessage);
    });
  });

  describe("When it receives an incorrect recipe id", () => {
    test("Then it should invoke next function with an error message.", async () => {
      const req = mockedRequest();
      req.body = recipeAndFavoriteTest;
      const next = jest.fn();
      const errorProperty = "message";
      const errorMessage =
        "Se ha producido un fallo al a??adir la receta a los favoritos del usuario.";
      User.findById = jest.fn().mockResolvedValue(userTest);
      userTest.save = jest.fn().mockRejectedValue("random error");

      await addFavorite(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(errorProperty);
      expect(next.mock.calls[0][0].message).toBe(errorMessage);
    });
  });

  describe("When it receives a registered id and a recipe id", () => {
    test("Then it should invoke res.json confirming the recipe id was added in myFavorites list correctly.", async () => {
      const req = mockedRequest();
      req.body = recipeAndFavoriteTest;
      const res = mockedResponse();
      const resText = {
        Resultado: `Receta a??adida a los favoritos del usuario id:${recipeAndFavoriteTest.id} correctamente.`,
      };
      User.findById = jest.fn().mockReturnValue(userTest);
      userTest.save = jest.fn().mockResolvedValue(true);

      await addFavorite(req, res, null);

      expect(res.json).toHaveBeenCalledWith(resText);
    });
  });
});

describe("Given a removeFavorite controller,", () => {
  describe("When it receives an incorrect deletedFavorite format,", () => {
    test("Then it should invoke next function with an error message.", async () => {
      const req = mockedRequest();
      const deletedFavoriteRecipeInfo = { ...recipeAndFavoriteTest };
      req.body = deletedFavoriteRecipeInfo;
      delete req.body.deletedFavorite;
      const next = jest.fn();

      await removeFavorite(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty("message");
      expect(next.mock.calls[0][0].message).toBe(
        "El formato del valor de la receta a borrar de favoritos es incorrecto."
      );
    });
  });

  describe("When it receives an non registered recipe id in myFavorites list,", () => {
    test("Then it should invoke next function with an error message.", async () => {
      const req = mockedRequest();
      const deletedFavoriteRecipeInfo = { ...recipeAndFavoriteTest };
      deletedFavoriteRecipeInfo.deletedFavorite = "randomFavoriteRecipeId";
      req.body = deletedFavoriteRecipeInfo;
      const errorProperty = "message";
      const errorMessage = `El usuario id: ${deletedFavoriteRecipeInfo.id} no tiene receta a??adida a favoritos con id: ${deletedFavoriteRecipeInfo.deletedFavorite}`;
      const next = jest.fn();
      User.findById = jest.fn().mockReturnValue(userTest);

      await removeFavorite(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(errorProperty);
      expect(next.mock.calls[0][0].message).toBe(errorMessage);
    });
  });

  describe("When it receives a favorite recipe id in myFavorites list but it can't be removed,", () => {
    test("Then it should invoke next function with an error message.", async () => {
      const req = mockedRequest();
      const deletedFavoriteRecipeInfo = { ...recipeAndFavoriteTest };
      req.body = deletedFavoriteRecipeInfo;
      const errorProperty = "message";
      const errorMessage =
        "Se ha producido un fallo al borrar la receta de favoritos al usuario.";
      const next = jest.fn();
      User.findById = jest.fn().mockReturnValue(userTest);
      userTest.save = jest.fn().mockRejectedValue("random error");

      await removeFavorite(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(errorProperty);
      expect(next.mock.calls[0][0].message).toBe(errorMessage);
    });
  });

  describe("When it receives a recipe id equal to a recipe id in myFavorites list of the user,", () => {
    test("Then it should invoke res.json with a confirmation message.", async () => {
      const req = mockedRequest();
      req.body = recipeAndFavoriteTest;
      const res = mockedResponse();
      const resText = {
        Resultado: `Receta borrada de favoritos al usuario id:${recipeAndFavoriteTest.id} correctamente.`,
      };
      User.findById = jest.fn().mockReturnValue(userTest);
      userTest.myFavorites.remove = jest
        .fn()
        .mockResolvedValue("randomFavoriteRecipeId");
      userTest.save = jest.fn().mockResolvedValue(true);

      await removeFavorite(req, res, null);

      expect(res.json).toHaveBeenCalledWith(resText);
    });
  });
});

describe("Given a removeUser controller,", () => {
  describe("When it receives a non registered user id,", () => {
    test("Then it should invoke next function with an error message.", async () => {
      const req = mockedRequest();
      req.body = { ...testUserId };
      const errorProperty = "message";
      const errorMessage = `No se ha encontrado al usuario id: ${req.body.id}`;
      const next = jest.fn();
      User.findById = jest.fn().mockReturnValue(false);

      await removeUser(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(errorProperty);
      expect(next.mock.calls[0][0].message).toBe(errorMessage);
    });
  });

  describe("When it receives a registered user id but it can't be deleted,", () => {
    test("Then it should invoke next function with an error message.", async () => {
      const req = mockedRequest();
      req.body = { ...testUserId };
      const errorProperty = "message";
      const errorMessage = `No se ha podido eliminar al usuario id: ${req.body.id}`;
      const next = jest.fn();
      User.findById = jest.fn().mockReturnValue(userTest);
      User.findByIdAndDelete = jest.fn().mockRejectedValue("random error");

      await removeUser(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(errorProperty);
      expect(next.mock.calls[0][0].message).toBe(errorMessage);
    });
  });

  describe("When it receives a registered user id,", () => {
    test("Then it should invoke res.json confirming the deleted id.", async () => {
      const req = mockedRequest();
      req.body = { ...testUserId };
      const res = mockedResponse();
      const resText = {
        resultado: `Se ha eliminado correctamente al usuario ${req.body.id}`,
      };
      User.findById = jest.fn().mockReturnValue(userTest);
      User.findByIdAndDelete = jest.fn().mockReturnValue("randomUserId");

      await removeUser(req, res, null);

      expect(res.json).toHaveBeenCalledWith(resText);
    });
  });
});
