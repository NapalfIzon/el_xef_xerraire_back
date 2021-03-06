import ErrorValidation from "../../interfaces/errorInterface";
import { notFoundHandler, finalErrorHandler } from "./error";

const mockedRes = (() => {
  const testedRes = {
    status: {},
    json: {},
  };
  testedRes.status = jest.fn().mockReturnValue(testedRes);
  testedRes.json = jest.fn().mockReturnValue(testedRes);

  return testedRes;
})();

describe("Given a notFoundHandler function,", () => {
  describe("When it receives a request and a response,", () => {
    test("Then it should invoke a res.json function with and object.", async () => {
      await notFoundHandler(null, mockedRes);

      expect(mockedRes.status).toHaveBeenCalled();
    });
  });
});

describe("Given a finalErrorHandler function,", () => {
  describe("When it receives an random error with statusCode 400", () => {
    test("Then it should return a response with message 'Credenciales erroneas!'", async () => {
      const error = new Error("Validation error") as ErrorValidation;
      error.statusCode = 400;

      await finalErrorHandler(error, null, mockedRes, null);

      expect(mockedRes.status).toHaveBeenCalled();
      expect(mockedRes.status).toHaveBeenCalledWith(400);
    });
  });

  describe("When it receives an random error, a request, a response and a next function,", () => {
    test("Then it should return a response with status 500.", async () => {
      const error = new Error("Validation error") as ErrorValidation;
      error.statusCode = 0;

      await finalErrorHandler(error, null, mockedRes, null);

      expect(mockedRes.status).toHaveBeenCalled();
      expect(mockedRes.status).toHaveBeenCalledWith(500);
    });
  });
});
