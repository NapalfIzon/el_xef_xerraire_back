import { Schema, model } from "mongoose";

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
    type: Number,
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
});

const Recipe = model("Recipe", recipeSchema, "recipes");

export default Recipe;
