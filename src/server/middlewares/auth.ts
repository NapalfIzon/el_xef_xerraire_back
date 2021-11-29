import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const auth = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authorizationData = req.header("Authorization");

  if (authorizationData) {
    const token = authorizationData.split(" ")[1];

    if (token) {
      try {
        const userData = await jwt.verify(token, process.env.XERRAPI_HASH);
        req.body.id = userData.id;
        next();
      } catch {
        const error: any = new Error(
          "La llave secreta del token no es la correcta."
        );
        error.code = 401;
        next(error);
      }
    } else {
      const error: any = new Error(
        "El formato del token dado no es el correcto."
      );
      error.code = 401;
      next(error);
    }
  } else {
    const error: any = new Error(
      "No hay código de autorización presente en la petición."
    );
    error.code = 401;
    next(error);
  }
};

export default auth;
