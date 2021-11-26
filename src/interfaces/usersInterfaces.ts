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
  username: string;
  email: string;
  password: string;
  avatar: string;
  avatarBackup: string;
  registrationDate: Date;
  myRecipes?: Array<string>;
  myFavorites?: Array<string>;
  save?: Function;
}

export interface UserRegistered {
  id?: string;
  email?: string;
  username: string;
  password: string;
}

export interface UserModified {
  id: string;
  username?: string;
  email?: string;
  password?: string;
  avatar?: string;
}

export interface RecipeModified {
  id: string;
  newRecipe?: string;
  newFavorite?: string;
  deletedRecipe?: string;
  deletedFavorite?: string;
}
