import { Schema, model } from "mongoose";

const quoteSchema = new Schema({
  quoteText: {
    type: String,
    required: true,
  },
  quoteAuthor: {
    type: String,
    required: true,
  },
  senderName: {
    type: String,
    required: false,
  },
  senderLink: {
    type: String,
    required: false,
  },
  quoteLink: {
    type: String,
    required: true,
  },
});

const Quote = model("Quote", quoteSchema, "quotes");

export default Quote;
