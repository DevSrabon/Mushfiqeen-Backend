const User = require("../models.js/Users");

exports.signupService = async (userInfo) => {
  const user = await User.create(userInfo);
  return user;
};

exports.findUserByEmail = async (email) => {
  return await User.findOne({ email }).populate("posts");
};

exports.findUserByToken = async (token) => {
  return await User.findOne({ confirmationToken: token });
};
exports.resetPasswordByToken = async (resetToken) => {
  return await User.findOne({
    passwordResetToken: resetToken,
    passwordResetExpires: { $gt: Date.now() },
  });
};

exports.deleteAll = async () => {
  return await User.deleteMany({});
};
