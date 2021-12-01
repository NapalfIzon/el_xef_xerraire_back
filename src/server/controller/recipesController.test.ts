import {
  mockedRequest,
  mockedResponse,
  mockedNext,
} from "../../mocks/mockedFunctions";
import Recipe from "../../database/models/recipe";
import {
  testRecipeId,
  recipeTest,
  searchTestWord,
} from "../../mocks/mockedVariables";
import { getRecipe, searchRecipe } from "./recipesController";

jest.mock("../../database/models/recipe");

describe("Given a getRecipe controller,", () => {
  describe("When it receives a non registered recipe id,", () => {
    test("Then it should invoke next funtion with an error message.", async () => {
      const req = mockedRequest();
      req.body = { ...testRecipeId };
      const next = mockedNext();
      const errorProperty = "message";
      const errorMessage = `No se ha encontrado la receta id: ${req.body.id}`;
      Recipe.findById = jest.fn().mockRejectedValue("random error");

      await getRecipe(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(errorProperty);
      expect(next.mock.calls[0][0].message).toBe(errorMessage);
    });
  });

  describe("When it receives a registered recipe id,", () => {
    test("Then it should invoke res.json with the detailed recipe.", async () => {
      const req = mockedRequest();
      req.body = { ...testRecipeId };
      Recipe.findById = jest.fn().mockReturnValue(recipeTest);
      const res = mockedResponse();

      await getRecipe(req, res, null);

      expect(res.json).toHaveBeenCalledWith(recipeTest);
    });
  });
});

describe("Given a searchRecipe controller,", () => {
  describe("When it receives a incorrect search parameter,", () => {
    test("Then it should invoke next funtion with an error message.", async () => {
      const req = mockedRequest();
      req.body = { searchValue: "random" };
      const next = mockedNext();
      const errorProperty = "message";
      const errorMessage = "El formato de la petición no es el correcto.";
      Recipe.find = jest.fn().mockRejectedValue("random error");

      await searchRecipe(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(errorProperty);
      expect(next.mock.calls[0][0].message).toBe(errorMessage);
    });
  });

  describe("When it receives an empty search parameter,", () => {
    test("Then it should invoke next funtion with an error message.", async () => {
      const req = mockedRequest();
      req.body = { searchValue: "" };
      const next = mockedNext();
      const errorProperty = "message";
      const errorMessage =
        "El formato de la palabra a buscar no es el correcto.";

      await searchRecipe(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(errorProperty);
      expect(next.mock.calls[0][0].message).toBe(errorMessage);
    });
  });

  describe("When it receives a word in a correct format,", () => {
    test("Then it should invoke res.json with an array of searched recipes.", async () => {
      const req = mockedRequest();
      req.body = { searchValue: searchTestWord };
      const res = mockedResponse();
      Recipe.find = jest.fn().mockResolvedValue(recipeTest);

      await searchRecipe(req, res, null);

      expect(res.json).toHaveBeenCalledWith(recipeTest);
    });
  });
});
