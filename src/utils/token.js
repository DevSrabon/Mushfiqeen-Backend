const jwt = require("jsonwebtoken");

exports.generateToken = (userInfo) => {
  const payload = {
    email: userInfo.email,
    role: userInfo.role,
    userId: userInfo._id,
  };
  const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: "30d",
  });
  return token;
};
