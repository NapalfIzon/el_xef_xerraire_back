import { Request, Response } from "express";

const mockedRequest = () => ({} as Request);

const mockedResponse = () => {
  const response = {} as Response;
  response.status = jest.fn().mockReturnThis();
  response.json = jest.fn().mockReturnThis();

  return response;
};

const mockedNext = () => jest.fn();

export { mockedRequest, mockedResponse, mockedNext };
