// src/models/User.Models.ts
import mongoose, { Schema, Model } from "mongoose";
import { IUser } from "../types/Users.Types";

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    avatar: {
      type: String,
      default: null,
    },

    provider: {
      type: String,
      required: true,
      enum: ["google", "github"],
    },

    providerId: {
      type: String,
      required: true,
    },

    isOnline: {
      type: Boolean,
      default: false,
    },

    lastSeen: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ provider: 1, providerId: 1 }, { unique: true });

UserSchema.index({ email: 1 });

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
