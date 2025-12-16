import jwt from "jsonwebtoken";
import { IUser } from "../types/Users.Types";

export function signToken(user: IUser) {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      isOnline: user.isOnline,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );
}
