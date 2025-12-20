import dotenv from "dotenv";
dotenv.config();

import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile as GoogleProfile,
} from "passport-google-oauth20";
import {
  Strategy as GitHubStrategy,
  Profile as GitHubProfile,
} from "passport-github2";
import User from "../models/User.Models";
import { VerifyCallback } from "passport-oauth2";
// Validate environment variables
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.warn("Google OAuth credentials missing");
}

if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
  console.warn("GitHub OAuth credentials missing");
}

console.log("GitHub Callback URL:", process.env.GITHUB_CALLBACK_URL);
console.log("Google Callback URL:", process.env.GOOGLE_CALLBACK_URL);

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: GoogleProfile,
      done: VerifyCallback
    ) => {
      try {
        console.log("Google profile received:", profile.id);

        const email = profile.emails?.[0].value;
        if (!email) {
          console.error("No email from Google profile");
          return done(null, false, { message: "No email provided" });
        }

        let user = await User.findOne({
          provider: "google",
          providerId: profile.id,
        });

        if (!user) {
          console.log("Creating new Google user");
          user = await User.create({
            name: profile.displayName,
            email,
            avatar: profile.photos?.[0].value,
            provider: "google",
            providerId: profile.id,
          });
        }

        console.log("Google auth success for user:", user._id);
        return done(null, user);
      } catch (error) {
        console.error("Google Strategy Error:", error);
        return done(error as Error, false);
      }
    }
  )
);

// GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: process.env.GITHUB_CALLBACK_URL!,
      scope: ["user:email"], // Tambahkan scope di sini
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: GitHubProfile,
      done: VerifyCallback
    ) => {
      try {
        console.log("GitHub profile received:", {
          id: profile.id,
          username: profile.username,
          emails: profile.emails,
        });

        const email = profile.emails?.[0]?.value;

        if (!email) {
          console.error("No email from GitHub profile");
          // Fallback: gunakan noreply email
          const fallbackEmail = `${profile.id}+${profile.username}@users.noreply.github.com`;
          console.log("Using fallback email:", fallbackEmail);

          let user = await User.findOne({
            provider: "github",
            providerId: profile.id,
          });

          if (!user) {
            user = await User.create({
              name: profile.username || profile.displayName || "GitHub User",
              email: fallbackEmail,
              avatar: profile.photos?.[0]?.value,
              provider: "github",
              providerId: profile.id,
            });
          }

          return done(null, user);
        }

        let user = await User.findOne({
          provider: "github",
          providerId: profile.id,
        });

        if (!user) {
          console.log("Creating new GitHub user");
          user = await User.create({
            name: profile.username || profile.displayName || "GitHub User",
            email,
            avatar: profile.photos?.[0]?.value,
            provider: "github",
            providerId: profile.id,
          });
        }

        console.log("GitHub auth success for user:", user._id);
        return done(null, user);
      } catch (error) {
        console.error("GitHub Strategy Error:", error);
        return done(error as Error, false);
      }
    }
  )
);

// Serialize/Deserialize user (opsional jika pakai session: false)
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
