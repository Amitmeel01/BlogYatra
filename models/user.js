const mongoose = require("mongoose");
const { createHmac, randomBytes } = require("crypto");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: "/images/default.avif",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;

  

  if (!user.isModified("password")) return next();

  const salt = randomBytes(16).toString("hex");
  

  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  

  user.salt = salt;
  user.password = hashedPassword;

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
