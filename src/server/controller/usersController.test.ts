import User from "../../database/models/user";
import { UserSchema } from "../../interfaces/usersInterfaces";
import { mockedRequest, mockedResponse } from "../../mocks/mockedFunctions";
import { addUser, getUserById } from "./usersController";

jest.mock("../../database/models/user");

const userTest: UserSchema = {
  username: "test",
  email: "test@test.com",
  password: "$2b$10$C8IeRGecLr60m88.B0JEkOqEdzboyKy0jZeCLHX4jBsOipPNpi7Iq",
  avatar: "/IMG/test.webp",
  avatarBackup: "/IMG/test.webp",
  registrationDate: "2021-11-27T15:19:05.521Z",
  myRecipes: [],
  myFavorites: [],
  id: "61a24c6990dd8c9d5d005339",
};

const newUserTest = {
  username: "test",
  email: "test@test.com",
  password: "test",
  avatar: "/IMG/test.webp",
};

describe("Given a getUserById controller,", () => {
  describe("When it receices a request with an inexistent user id in the params,", () => {
    test("Then it should invoke res.json with the data of the user.", async () => {
      const testUserId = "whatever";
      const req = mockedRequest();
      req.params = {
        id: testUserId,
      };
      User.findById = jest.fn().mockRejectedValue("error");
      const next = jest.fn();

      await getUserById(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty("code");
      expect(next.mock.calls[0][0].code).toBe(404);
    });
  });

  describe("When it receives a request with an user id in the params,", () => {
    test("Then it should invoke res.json with the data of the user.", async () => {
      const testUserId = "61a24c6990dd8c9d5d005339";
      const req = mockedRequest();
      req.params = {
        id: testUserId,
      };
      User.findById = jest.fn().mockResolvedValue(userTest);
      const res = mockedResponse();

      await getUserById(req, res, null);

      expect(res.json).toHaveBeenCalledWith(userTest);
    });
  });
});

describe("Given a addUser controller,", () => {
  describe("When it receives new user data with an existing email,", () => {
    test("Then it should next funtion with an error message 'Email ya registrado.'", async () => {
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
    test("Then it should next funtion with an error message 'No se ha podido añadir al usuario solicitado'", async () => {
      const req = mockedRequest();
      req.body = newUserTest;
      const next = jest.fn();
      User.findOne = jest.fn().mockResolvedValue(false);
      User.create = jest.fn().mockRejectedValue("whatever");

      await addUser(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty("message");
      expect(next.mock.calls[0][0].message).toBe(
        "No se ha podido añadir al usuario solicitado."
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
