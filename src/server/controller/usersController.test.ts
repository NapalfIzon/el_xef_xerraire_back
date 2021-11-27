import User from "../../database/models/user";
import mockedResponse from "../../mocks/mockedFunctions";
import { getUserById } from "./usersController";

jest.mock("../../database/models/user");

const userTest = {
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

describe("Given a getUserById controller,", () => {
  describe("When it receices a request with an inexistent user id in the params,", () => {
    test("Then it should invoke res.json with the data of the user.", async () => {
      const testUserId = "whatever";
      const req = {
        params: {
          id: testUserId,
        },
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
      const req = {
        params: {
          id: testUserId,
        },
      };
      User.findById = jest.fn().mockResolvedValue(userTest);
      const res = mockedResponse();

      await getUserById(req, res, null);

      expect(res.json).toHaveBeenCalledWith(userTest);
    });
  });
});
