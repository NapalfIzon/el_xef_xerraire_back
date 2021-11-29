import {
  mockedRequest,
  mockedResponse,
  mockedNext,
} from "../../mocks/mockedFunctions";
import Recipe from "../../database/models/recipe";
import { testRecipeId, recipeTest } from "../../mocks/mockedVariables";
import { getRecipeById } from "./recipesController";

jest.mock("../../database/models/recipe");

describe("Given a getRecipeById controller,", () => {
  describe("When it receives a non registered recipe id,", () => {
    test("Then it should invoke next funtion with an error message.", async () => {
      const req = mockedRequest();
      req.body = { ...testRecipeId };
      Recipe.findById = jest.fn().mockReturnValue("random error");
      const next = mockedNext;
      const errorProperty = "message";
      const errorMessage = `No se ha encontrado la receta id: ${req.body.id}`;

      await getRecipeById(req, null, next);

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

      await getRecipeById(req, res, null);

      expect(res.json).toHaveBeenCalledWith(recipeTest);
    });
  });
});
