import mongoose from "mongoose";
import chalk from "chalk";
import Debug from "debug";

const debug = Debug("xerrAPI:mongoDBServer");

const initializeMongoDBServer = (endpoint) =>
  new Promise<void>((resolve, reject) => {
    mongoose.connect(endpoint, (error: { message: string }) => {
      if (error) {
        debug(chalk.bgRed.greenBright("No se ha conectado a BD - ಥ╭╮ಥ"));
        debug(chalk.bgRed.greenBright(error.message));
        reject(error);
        return;
      }
      debug(chalk.bgGreen.redBright("Conectado a BD - ᕦ( ͡° ͜ʖ ͡°)ᕤ"));
      resolve();
    });
    mongoose.set("debug", true);
    mongoose.set("toJSON", {
      virtuals: true,
      transform: (doc, ret) => {
        // eslint-disable-next-line no-underscore-dangle
        delete ret._id;
      },
    });
  });

export default initializeMongoDBServer;
