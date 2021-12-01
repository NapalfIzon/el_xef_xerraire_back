export interface RecipesPaths {
  getRecipes: string;
  getRandomRecipes: string;
  getRecipe: string;
  getRecipeByWord: string;
  addRecipe: string;
  uploadVote: string;
  modifyRecipe: string;
  removeRecipe: string;
}

export interface RecipeSchema {
  id?: string;
  title: string;
  description: string;
  category: string;
  ingredients: Array<string>;
  tools?: Array<string>;
  steps: Array<string>;
  image: string;
  imageBackup?: string;
}
