import chalk from "chalk";
import Debug from "debug";

const { ValidationError } = require("express-validation");

const debug = Debug("xerrAPI:error");

const notFoundHandler = (req, res) => {
  debug(
    chalk.bgYellow.magenta.greenBright(
      `Se ha hecho una petición a un endpoint inexistente ಥ╭╮ಥ`
    )
  );
  res.status(404).json({ error: "Endpoint no encontrado!" });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const finalErrorHandler = (error, req, res, next) => {
  debug(
    chalk.bgYellow.magenta.greenBright(`Se ha un error en el servidor ಥ╭╮ಥ`)
  );

  if (error instanceof ValidationError) {
    error.code = 400;
    error.message = "Credenciales erroneas!";
  }

  debug("El error generado ha sido: ", error.message);
  const message = error.code ? error.message : "Error General";
  res.status(error.code || 500).json({ error: message });
};

export { notFoundHandler, finalErrorHandler };
