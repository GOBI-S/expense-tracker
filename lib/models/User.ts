import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
    },

    email: {
      type: String,
    },

    photoURL: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);