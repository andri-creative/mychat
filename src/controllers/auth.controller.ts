import { Request, Response } from "express";
import { signToken } from "../utils/jwt";
import { IUser } from "../types/Users.Types";

export function oauthCallback(req: Request, res: Response) {
  const user = req.user as IUser;
  const token = signToken(user);

  res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
}
