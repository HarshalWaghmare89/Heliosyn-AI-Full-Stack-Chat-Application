import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    //--->> USER NAME

    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name must be less than 50 characters"],
    },

    //--->>> EMAIL

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },

    //--->> AUTH PROVIDER

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
      required: true,
    },

    //---->>> LOCAL AUTH PASSWORD

    password: {
      type: String,
      minlength: [8, "Password must be at least 8 characters"],
      maxlength: [128, "Password must be less than 128 characters"],
      select: false,
      required: function () {
        return this.authProvider === "local";
      },
    },

    //--->> GOOGLE AUTH
    // Google's unique identifier for the user.

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    //--->>> EMAIL VERIFICATION

    // Local users can initially be unverified.
    // Google users are considered verified because
    // Google has already verified the email account.

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    //--->>> PROFILE AVATAR

    avatar: {
      type: String,
      default: null,
    },

    //--->>> ACCOUNT STATUS

    isActive: {
      type: Boolean,
      default: true,
    },

    //--->>> LAST LOGIN

    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
