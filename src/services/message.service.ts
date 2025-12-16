import Message from "../models/Message.Models";
import { Types } from "mongoose";
import { IMessage } from "../types/Message.Types";

export class MessageService {
  static async createMessage(data: {
    sender: Types.ObjectId;
    content: string;
    replyTo?: Types.ObjectId;
  }): Promise<IMessage> {
    const message = new Message({
      ...data,
      readBy: [data.sender],
    });

    return await message.save();
  }

  static async getMessageById(
    id: string | Types.ObjectId
  ): Promise<IMessage | null> {
    return await Message.findById(id)
      .populate("sender", "name email avatar")
      .populate("replyTo", "content sender");
  }

  static async getMessages(
    page: number = 1,
    limit: number = 50
  ): Promise<{ messages: IMessage[]; total: number; totalPages: number }> {
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      Message.find({ isDeleted: false })
        .populate("sender", "name email avatar")
        .populate("replyTo", "content sender")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Message.countDocuments({ isDeleted: false }),
    ]);

    return {
      messages,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async updateMessage(
    messageId: string | Types.ObjectId,
    userId: Types.ObjectId,
    content: string
  ): Promise<IMessage | null> {
    const message = await Message.findOne({
      _id: messageId,
      sender: userId,
      isDeleted: false,
    });

    if (!message) {
      return null;
    }

    message.content = content;
    message.isEdited = true;
    message.editedAt = new Date();

    return await message.save();
  }

  static async deleteMessage(
    messageId: string | Types.ObjectId,
    userId: Types.ObjectId
  ): Promise<boolean> {
    const result = await Message.updateOne(
      {
        _id: messageId,
        sender: userId,
        isDeleted: false,
      },
      {
        isDeleted: true,
        deletedAt: new Date(),
      }
    );

    return result.modifiedCount > 0;
  }

  static async markAsRead(
    messageId: string | Types.ObjectId,
    userId: Types.ObjectId
  ): Promise<IMessage | null> {
    return await Message.findByIdAndUpdate(
      messageId,
      {
        $addToSet: { readBy: userId },
      },
      { new: true }
    );
  }

  static async getUnreadMessages(userId: Types.ObjectId): Promise<IMessage[]> {
    return await Message.find({
      readBy: { $ne: userId },
      isDeleted: false,
      sender: { $ne: userId },
    })
      .populate("sender", "name email avatar")
      .sort({ createdAt: -1 });
  }
}
