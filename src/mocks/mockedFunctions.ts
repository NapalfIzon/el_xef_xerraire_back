import { Response } from "express";

const mockedResponse = () => {
  const response = {} as Response;
  response.status = jest.fn().mockReturnThis();
  response.json = jest.fn().mockReturnThis();

  return response;
};

export default mockedResponse;
