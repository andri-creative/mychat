import { Router, Request, Response, NextFunction } from "express";
import passport from "../config/passport"; // Import dari config
import { oauthCallback } from "../controllers/auth.controller";
import { IUser } from "../types/Users.Types";

const router = Router();

// Google OAuth Routes
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false, // Karena kita pakai JWT
  })
);

router.get(
  "/google/callback",
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "google",
      { session: false },
      (err: Error | null, user: IUser | false, info: any) => {
        console.log("=== Google Callback ===");
        console.log("Error:", err);
        console.log("User:", user ? user._id : null);
        console.log("Info:", info);

        if (err) {
          console.error("Google auth error:", err);
          return res.redirect(
            `${
              process.env.FRONTEND_URL
            }/auth/error?message=${encodeURIComponent(err.message)}`
          );
        }

        if (!user) {
          console.error("No user returned from Google auth");
          return res.redirect(
            `${process.env.FRONTEND_URL}/auth/error?message=Authentication failed`
          );
        }

        req.user = user;
        next();
      }
    )(req, res, next);
  },
  oauthCallback
);

// GitHub OAuth Routes
router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"],
    session: false,
  })
);

router.get(
  "/github/callback",
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "github",
      { session: false },
      (err: Error | null, user: IUser | false, info: any) => {
        console.log("=== GitHub Callback ===");
        console.log("Error:", err);
        console.log("User:", user ? (user as any)._id : null);
        console.log("Info:", info);
        console.log("Query:", req.query);

        if (err) {
          console.error("GitHub auth error:", err);
          return res.redirect(
            `${
              process.env.FRONTEND_URL
            }/auth/error?message=${encodeURIComponent(err.message)}`
          );
        }

        if (!user) {
          console.error("No user returned from GitHub auth");
          return res.redirect(
            `${process.env.FRONTEND_URL}/auth/error?message=Authentication failed`
          );
        }

        req.user = user;
        next();
      }
    )(req, res, next);
  },
  oauthCallback
);

export default router;
