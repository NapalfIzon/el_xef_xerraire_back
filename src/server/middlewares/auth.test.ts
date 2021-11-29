import jwt from "jsonwebtoken";
import { mockedRequest } from "../../mocks/mockedFunctions";
import {
  authorizationHeaderRequestKo,
  authorizationHeaderRequestOk,
} from "../../mocks/mockedVariables";
// import { testUserId } from "../../mocks/mockedVariables";
import auth from "./auth";

describe("Given a auth middleware,", () => {
  describe("When it isn't a authorization in the header request,", () => {
    test("Then it should invoke next with and error with a information message.", async () => {
      const req = mockedRequest();
      req.header = jest.fn().mockReturnValue(null);
      const errorProperty = "message";
      const errorMessage =
        "No hay código de autorización presente en la petición.";
      const next = jest.fn();

      await auth(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(errorProperty);
      expect(next.mock.calls[0][0].message).toBe(errorMessage);
    });
  });

  describe("When it receives an incorrect authorization format,", () => {
    test("Then it should invoke next with and error with a information message.", async () => {
      const req = mockedRequest();
      const { Authorization } = authorizationHeaderRequestKo;
      req.header = jest.fn().mockReturnValue(Authorization);
      const errorProperty = "message";
      const errorMessage = "El formato del token dado no es el correcto.";
      const next = jest.fn();

      await auth(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(errorProperty);
      expect(next.mock.calls[0][0].message).toBe(errorMessage);
    });
  });

  describe("When it receives a no valid token,", () => {
    test("Then it should invoke next with and error with a information message.", async () => {
      const req = mockedRequest();
      const { Authorization } = authorizationHeaderRequestOk;
      req.header = jest.fn().mockReturnValue(Authorization);
      const errorProperty = "message";
      const errorMessage = "La llave secreta del token no es la correcta.";
      const next = jest.fn();
      jwt.verify = jest.fn().mockResolvedValue(false);

      await auth(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(errorProperty);
      expect(next.mock.calls[0][0].message).toBe(errorMessage);
    });
  });

  describe("When it receives a valid token,", () => {
    test("Then it should invoke next without any information", async () => {
      const req = mockedRequest();
      const { Authorization } = authorizationHeaderRequestOk;
      req.header = jest.fn().mockReturnValue(Authorization);
      const next = jest.fn();
      jwt.verify = jest.fn().mockResolvedValue(true);

      await auth(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
