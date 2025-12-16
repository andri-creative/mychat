import User from "../models/User.Models";
import { Types } from "mongoose";
import { IUser } from "../types/Users.Types";

export class UserService {
  static async findById(id: string | Types.ObjectId): Promise<IUser | null> {
    return await User.findById(id);
  }

  static async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  static async findByProvider(
    provider: string,
    providerId: string
  ): Promise<IUser | null> {
    return await User.findOne({ provider, providerId });
  }

  static async updateOnlineStatus(
    userId: string | Types.ObjectId,
    isOnline: boolean
  ): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      userId,
      {
        isOnline,
        lastSeen: new Date(),
      },
      { new: true }
    );
  }

  static async getAllOnlineUsers(): Promise<IUser[]> {
    return await User.find({ isOnline: true }).sort({ lastSeen: -1 });
  }

  static async getAllUsers(): Promise<IUser[]> {
    return await User.find().sort({ createdAt: -1 });
  }

  static async searchUsers(query: string): Promise<IUser[]> {
    return await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    });
  }
}
