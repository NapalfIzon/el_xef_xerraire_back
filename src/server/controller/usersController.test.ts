import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../database/models/user";
import { UserSchema, UserRegistered } from "../../interfaces/usersInterfaces";
import { mockedRequest, mockedResponse } from "../../mocks/mockedFunctions";
import { addUser, getUserById, modifyUser, userLogin } from "./usersController";

jest.mock("../../database/models/user");

const userTest: UserSchema = {
  username: "test",
  email: "test@test.com",
  password: "$2b$10$C8IeRGecLr60m88.B0JEkOqEdzboyKy0jZeCLHX4jBsOipPNpi7Iq",
  avatar: "/IMG/test.webp",
  avatarBackup: "/IMG/test.webp",
  registrationDate: new Date("2021-11-27T15:19:05.521Z"),
  myRecipes: [],
  myFavorites: [],
  id: "61a24c6990dd8c9d5d005339",
};

const newUserTest = {
  id: "12345",
  username: "test",
  email: "test@test.com",
  password: "test",
  avatar: "/IMG/test.webp",
};

const userLoginTest = async () => {
  const userData: UserRegistered = {
    id: "whatever",
    email: "test@test.com",
    password: await bcrypt.hash("test", 10),
  };

  return userData;
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
    test("Then it should invoke next funtion with an error message 'No se ha podido añadir al usuario solicitado'", async () => {
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

describe("Given a userLogin controller,", () => {
  describe("When it receives a non registered email,", () => {
    test("Then it should invoke next function with an error with message 'Datos incorrectos'", async () => {
      const req = mockedRequest();
      const testingUser: UserRegistered = await userLoginTest();
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
    test("Then it should invoke next function with an error with message 'Datos incorrectos'", async () => {
      const req = mockedRequest();
      const testingUser: UserRegistered = await userLoginTest();
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
      const testingUser: UserRegistered = await userLoginTest();
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
    test("Then it should invoke next function with an error with message 'Formato de datos incorrectos.'", async () => {
      const req = mockedRequest();
      req.body = newUserTest;
      const next = jest.fn();
      User.findByIdAndUpdate = jest.fn().mockRejectedValue("whatever");

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
