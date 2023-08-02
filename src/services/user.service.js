const User = require("../models.js/Users");

exports.signupService = async (userInfo) => {
  const user = await User.create(userInfo);
  return user;
};

exports.findUserByEmail = async (email) => {
  return await User.findOne({ email }).populate("posts");
};
exports.findUserById = async (id, body) => {
  return await User.findByIdAndUpdate(id, body);
};
exports.findByJwt = async (email) => {
  return await User.findOne({ email }).select("-__V  -comments -password");
};
exports.findUserByToken = async (token, email) => {
  return await User.findOne({ confirmationToken: token, email });
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
