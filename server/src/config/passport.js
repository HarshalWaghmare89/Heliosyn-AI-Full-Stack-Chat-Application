import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import User from "../models/User.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        //--->>> GOOGLE USER INFORMATION

        const googleId = profile.id;

        const email = profile.emails?.[0]?.value?.toLowerCase().trim();

        const name =
          profile.displayName ||
          `${profile.name?.givenName || ""} ${
            profile.name?.familyName || ""
          }`.trim();

        const avatar = profile.photos?.[0]?.value || null;

        //--->>> VALIDATE GOOGLE EMAIL

        if (!email) {
          return done(
            new Error("Google account does not provide an email address."),
            null,
          );
        }

        //--->>> FIND USER BY EMAIL

        let user = await User.findOne({
          email,
        });

        //---->>> CREATE NEW GOOGLE USER

        if (!user) {
          user = await User.create({
            name,
            email,
            avatar,
            authProvider: "google",
            googleId,
            isEmailVerified: true,
            isActive: true,
            lastLoginAt: new Date(),
          });
        } else {
          if (!user.isActive) {
            return done(new Error("Your account has been disabled."), null);
          }

          //--->>> LINK GOOGLE ID

          if (!user.googleId) {
            user.googleId = googleId;
          }

          //---->>> UPDATE GOOGLE PROFILE DATA

          if (avatar) {
            user.avatar = avatar;
          }

          user.lastLoginAt = new Date();

          await user.save();
        }

        //---->>> AUTHENTICATION SUCCESS

        return done(null, user);
      } catch (error) {
        console.error("Google OAuth Strategy Error:", error);

        return done(error, null);
      }
    },
  ),
);

export default passport;
