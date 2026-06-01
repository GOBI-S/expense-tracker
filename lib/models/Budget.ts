import mongoose, { Schema } from "mongoose";

const BudgetSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    limit: {
      type: Number,
      required: true,
    },

    spent: {
      type: Number,
      default: 0,
    },

    month: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Budget ||
  mongoose.model("Budget", BudgetSchema);