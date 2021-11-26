export interface UsersPaths {
  getUserById: string;
  addUser: string;
  userLogin: string;
  modifyUser: string;
  removeUser: string;
  addRecipe: string;
  removeRecipe: string;
  addFavorite: string;
  removeFavorite: string;
}

export interface UserSchema {
  username: String;
  email: String;
  password: String;
  avatar: String;
  avatarBackup: String;
  registrationDate: Date;
  myRecipes?: Array<String>;
  myFavorites?: Array<String>;
  save?: Function;
}

export interface UserRegistered {
  id?: String;
  email?: String;
  username: String;
  password: String;
}

export interface UserModified {
  id: String;
  username?: String;
  email?: String;
  password?: String;
  avatar?: String;
}

export interface RecipeModified {
  id: String;
  newRecipe?: String;
  newFavorite?: String;
  deletedRecipe?: String;
  deletedFavorite?: String;
}
