const { signupService, findUserByEmail } = require("../services/user.service");
const { generateToken } = require("../utils/token");

exports.signup = async (req, res) => {
  try {
    const user = await signupService(req.body);
    res.status(200).json({
      status: "success",
      message: "Successfully signed up",
      data: user,
    });
  } catch (error) {
    console.log({ error });
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log({ email, password });
    if (!email || !password) {
      return res.status(401).json({
        status: "fail",
        error: "Please provide your credentials",
      });
    }

    const user = await findUserByEmail(email);
    console.log(
      "🚀 ~ file: user.controller.js:32 ~ exports.login= ~ user:",
      user
    );
    if (!user) {
      return res.status(401).json({
        status: "fail",
        error: "No user found, Please create an account",
      });
    }

    const isPasswordValid = user.comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(403).json({
        status: "fail",
        error: "Password is not correct",
      });
    }
    if (user.status != "inactive") {
      return res.status(401).json({
        status: "fail",
        error: "Your account is not active yet",
      });
    }

    const token = generateToken(user);

    const { password: pwd, ...others } = user.toObject();

    res.status(200).json({
      status: "success",
      message: "Successfully login up",
      data: { user: others, token },
    });
  } catch (error) {
    console.log({ error });
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.getToken = async (req, res) => {
  try {
    const { email } = req.user;

    const user = await findUserByEmail(email);
    if (user) {
      const accessToken = generateToken(user);
      res.status(200).json({
        status: "success",
        user,
        accessToken,
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
