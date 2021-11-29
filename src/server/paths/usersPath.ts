import { UsersPaths } from "../../interfaces/usersInterface";

const usersPath: UsersPaths = {
  getUserById: "/getuser",
  addUser: "/new",
  userLogin: "/login",
  modifyUser: "/modifyuser",
  removeUser: "/removeuser",
  addRecipe: "/addrecipe",
  removeRecipe: "/removerecipe",
  addFavorite: "/addfavorite",
  removeFavorite: "/removefavorite",
};

export default usersPath;
