import { Schema, model } from "mongoose";
import { RecipeSchema } from "../../interfaces/recipesInterface";

const recipeSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  ingredients: {
    type: [String],
    required: true,
  },
  tools: {
    type: [String],
    required: false,
  },
  steps: {
    type: [String],
    required: true,
  },
  isXerrApi: {
    type: Boolean,
    default: true,
  },
  image: {
    type: String,
    required: false,
  },
  imageBackup: {
    type: String,
    required: false,
  },
  valoration: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  quantityValorations: {
    type: Number,
    required: true,
  },
});

const Recipe = model<RecipeSchema>("Recipe", recipeSchema, "recipes");

export default Recipe;
