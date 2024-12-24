import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const saltNum = 10;
const tokenExp = "1h";
const roles = ["super_admin", "admin", "staff"];

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: roles, default: "super_admin" },
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    phone: { type: String, required: true },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
  },
  { timestamps: true }
);

/* pre save middleware to hash the password before saving the user info */
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(saltNum);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

/* method to compare the provided password with the stored hashed password */
UserSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    throw new Error(err);
  }
};

/* method to generate JWT token for the user */
UserSchema.methods.generateAuthToken = function () {
  const payload = {
    userid: this._id,
    email: this.email,
    role: this.role,
  };

  /* Create token with a secret key and an expiration time (e.g., 1 hour) */
  const token = jwt.sign(payload, process.env.APP_JWT_SEC, {
    expiresIn: tokenExp,
  });
  return token;
};

export const User = mongoose.model("User", UserSchema);
