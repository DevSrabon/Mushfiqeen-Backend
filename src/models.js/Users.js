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
      minlength: [6, "Minimum length must be at list 6 character"],
      // validate: {
      //   validator: (value) =>
      //     validator.isStrongPassword(value, {
      //       minLength: 6,
      //       // minLowerCase: 3,
      //       // minNumbers: 1,
      //       // minUpperCase: 1,
      //       // minSymbols: 1,
      //     }),
      //   message: "Password {VALUE} is not strong enough",
      // },
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
      required: [true, "Please provide your Image"],
      validate: [validator.isURL, "Please provide a valid url"],
    },
    designation: {
      type: String,
      required: false,
      minLength: [3, "designation must be at least 3 characters"],
      maxlength: [50, "designation is too large"],
    },
    address: {
      type: String,
      required: false,
      minLength: [3, "address must be at least 3 characters"],
      maxlength: [100, "address is too large"],
    },
    country: {
      type: String,
      required: false,
    },
    dateOfBirth: {
      type: Date,
      required: false,
    },
    bio: {
      type: String,
      minLength: [3, "bio must be at least 3 characters"],
      maxlength: [300, "bio is too large"],
    },
    status: {
      type: String,
      default: "inactive",
      enum: ["active", "inactive", "blocked"],
    },
    followers: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    posts: [{ type: mongoose.Types.ObjectId, ref: "Post" }],
    comments: [{ type: mongoose.Types.ObjectId, ref: "Post" }],
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
  const token = Math.floor(Math.random() * 90000) + 10000;
  this.confirmationToken = token;
  const date = new Date();
  date.setDate(date.getDate() + 1);
  this.confirmationTokenExpire = date;
  return token;
};

userSchema.methods.generateResetToken = function () {
  const token = Math.floor(Math.random() * 90000) + 10000;
  this.passwordResetToken = token;
  const date = new Date();
  date.setDate(date.getDate() + 1);
  this.passwordResetExpires = date;
  return token;
};

userSchema.methods.addFollower = async function (followerId) {
  if (!this.followers.includes(followerId)) {
    this.followers.push(followerId);
    await this.save();
  }
};

userSchema.methods.followUser = async function (userIdToFollow) {
  if (!this.following.includes(userIdToFollow)) {
    this.following.push(userIdToFollow);
    await this.save();
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
