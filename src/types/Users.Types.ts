// src/types/Users.Types.ts

import { Document, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  avatar?: string | null;
  provider: "google" | "github";
  providerId: string;
  isOnline: boolean;
  lastSeen: Date;
  createdAt: Date;
  updatedAt: Date;
}
