// config/passport.ts

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
      const email = profile.emails?.[0].value;
      if (!email) return done(null, false);

      let user = await User.findOne({
        provider: "google",
        providerId: profile.id,
      });

      if (!user) {
        user = await User.create({
          name: profile.displayName,
          email,
          avatar: profile.photos?.[0].value,
          provider: "google",
          providerId: profile.id,
        });
      }

      return done(null, user);
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: process.env.GITHUB_CALLBACK_URL!,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: GitHubProfile,
      done: VerifyCallback
    ) => {
      const email = profile.emails?.[0].value;
      if (!email) return done(null, false);

      let user = await User.findOne({
        provider: "github",
        providerId: profile.id,
      });

      if (!user) {
        user = await User.create({
          name: profile.username || "Github User",
          email,
          avatar: profile.photos?.[0].value,
          provider: "github",
          providerId: profile.id,
        });
      }

      return done(null, user);
    }
  )
);

export default passport;
