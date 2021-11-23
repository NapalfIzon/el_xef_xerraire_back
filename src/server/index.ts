import express from "express";
import chalk from "chalk";
import Debug from "debug";
import morgan from "morgan";
import cors from "cors";
import { notFoundHandler, finalErrorHandler } from "./middlewares/error";

const debug = Debug("xerrAPI:server");

const app = express();
app.disable("x-powered-by");

const initializeServer = (port: number) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      debug(
        chalk.bgGreen.redBright(
          `xerrAPI ejecutándose OK y escuchando el puerto ${port} ${"ᕦ( ͡° ͜ʖ ͡°)ᕤ"}`
        )
      );
      resolve(server);
    });

    server.on("error", (error: { code: string }) => {
      debug(
        chalk.bgRed.greenBright(
          `Ha habido un problema inicializando el servidor ಥ╭╮ಥ`
        )
      );

      if (error.code === "EADDRINUSE") {
        debug(chalk.bgRed.white(`El puerto ${port} está en uso ಥ╭╮ಥ`));
      }

      reject();
    });

    server.on("close", () => {
      debug(
        chalk.bgBlue.white(
          `Se ha desconectado el servidor correctamente ( ͡° ͜ʖ ͡°)`
        )
      );
    });
  });

app.use(morgan("dev"));

app.use(cors());

app.use(express.json());

app.use(notFoundHandler);

app.use(finalErrorHandler);

export { app, initializeServer };
