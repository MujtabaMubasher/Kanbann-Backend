import mongoose, { Schema } from "mongoose";

const todoSchema = new Schema(
  {
    ticketName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,  
      maxlength: 100, 
    },

    category: {
      type: String,
      required: true,
      enum: ["To Do", "In Progress", "Done"], 
      default: "To Do",
      trim: true,
    },

    ticketDescription: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,  
      maxlength: 500, 
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,  
    },
  },

  { timestamps: true }
);

export const Todo = mongoose.model("Todo", todoSchema);
