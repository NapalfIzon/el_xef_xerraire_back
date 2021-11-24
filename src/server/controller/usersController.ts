import chalk from "chalk";
import Debug from "debug";

const debug = Debug("xerrAPI:usersController");

const getUserById = () => {
  debug(
    chalk.bgGray.black("Se ha hecho una consulta de usuario a la BBDD (´ ▽ `)b")
  );
};

const addUser = () => {
  debug(chalk.bgGray.black("Se ha añadido un usuario a la BBDD (´ ▽ `)b"));
};

const userLogin = () => {
  debug(
    chalk.bgGray.black("Se ha generado el token para el usuario XXX (´ ▽ `)b")
  );
};

const modifyUser = () => {
  debug(
    chalk.bgGray.black("Se ha modificado al usuario XXX en la BBDD (´ ▽ `)b")
  );
};

export { getUserById, addUser, userLogin, modifyUser };
