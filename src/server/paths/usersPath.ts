import { UsersPaths } from "../../interfaces/usersInterfaces";

const usersPath: UsersPaths = {
  getUserById: "/user/:id",
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