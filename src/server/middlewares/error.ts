import chalk from "chalk";
import Debug from "debug";
import ErrorValidation from "../../interfaces/errorInterface";

const debug = Debug("xerrAPI:error");

const notFoundHandler = (req, res) => {
  debug(
    chalk.bgYellow.magenta.greenBright(
      `Se ha hecho una petición a un endpoint inexistente ಥ╭╮ಥ`
    )
  );
  res.status(404).json({ error: "Endpoint no encontrado!" });
};

const finalErrorHandler = (
  error: ErrorValidation,
  req,
  res,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next
) => {
  debug(
    chalk.bgYellow.magenta.greenBright(`Se ha un error en el servidor ಥ╭╮ಥ`)
  );

  if (error.statusCode === 400) {
    error.code = 400;
    error.message = "Credenciales erroneas!";
  }

  debug("El error generado ha sido: ", error.message);
  const message = error.code ? error.message : "Error General";
  res.status(error.code || 500).json({ error: message });
};

export { notFoundHandler, finalErrorHandler };
