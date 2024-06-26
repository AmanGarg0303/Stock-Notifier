import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      // required: [true, "Please add a password!"],
      minLength: [5, "Password must be atleast 5 characters long."],
    },
    emailAlerts: {
      type: Boolean,
      default: false,
    },
    highPrice: {
      type: Number,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    emailTime: {
      type: Date,
      default: Date.now(),
    },
    stockVals: {
      value: {
        type: String,
        default: "",
      },
      label: {
        type: String,
        default: "",
      },
    },
    subscription: {
      id: String,
      status: String,
    },
    freeTrial: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving to db
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  // Hashing password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
