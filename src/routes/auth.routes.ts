import { Router, Request, Response, NextFunction } from "express";
import passport from "passport";
import { oauthCallback } from "../controllers/auth.controller";
import { IUser } from "../types/Users.Types";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "google",
      { session: false },
      (err: Error | null, user: IUser | false) => {
        if (err || !user) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        req.user = user;
        next();
      }
    )(req, res, next);
  },
  oauthCallback
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "github",
      { session: false },
      (err: Error | null, user: IUser | false) => {
        if (err || !user) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        req.user = user;
        next();
      }
    )(req, res, next);
  },
  oauthCallback
);

export default router;
