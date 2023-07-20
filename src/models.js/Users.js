const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      validate: [validator.isEmail, "Provide a valid Email"],
      required: [true, "Email address is required"],
      unique: [true, "Email is already taken"],
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],

      validate: {
        validator: (value) =>
          validator.isStrongPassword(value, {
            minLength: 6,
            // minLowerCase: 3,
            // minNumbers: 1,
            // minUpperCase: 1,
            // minSymbols: 1,
          }),
        message: "Password {VALUE} is not strong enough",
      },
    },
    confirmPassword: {
      type: String,
      require: [true, "Please confirm your password"],
      validate: {
        validator: function (value) {
          return value === this.password;
        },
        message: "Passwords did't match",
      },
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    fullName: {
      type: String,
      required: [true, "Please provide your name"],
      minLength: [3, "Name must be at least 3 characters"],
      maxlength: [30, "Name is too large"],
    },
    contactNumber: {
      type: String,
      validate: [
        validator.isMobilePhone,
        "Please provide a valid contact number",
      ],
    },
    imageURL: {
      type: String,
      validate: [validator.isURL, "Please provide a valid url"],
    },
    designation: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      default: "inactive",
      enum: ["active", "inactive", "blocked"],
    },
    posts: [{ type: mongoose.Types.ObjectId, ref: "Post" }],
    confirmationToken: String,
    confirmationTokenExpire: String,
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  const password = this.password;
  const saltRounds = 10;

  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
      return next(err);
    }
    this.password = hashedPassword;
    this.confirmPassword = undefined;
    next();
  });
});

userSchema.methods.comparePassword = function (password, hash) {
  const isPasswordValid = bcrypt.compareSync(password, hash);
  return isPasswordValid;
};

userSchema.methods.generateConfirmationToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.confirmationToken = token;
  const date = new Date();
  date.setDate(date.getDate() + 1);
  this.confirmationTokenExpire = date;
  return token;
};

userSchema.methods.generateResetToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = token;
  const date = new Date();
  date.setDate(date.getDate() + 1);
  this.passwordResetExpires = date;
  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
