const {
  signupService,
  findUserByEmail,
  deleteAll,
  findUserByToken,
  resetPasswordByToken,
} = require("../services/user.service");
const { verifyEmail } = require("../utils/emailVerification");
const { generateToken } = require("../utils/token");

exports.signup = async (req, res) => {
  try {
    const user = await signupService(req.body);
    const accessToken = generateToken(user);

    res.status(200).json({
      status: "success",
      message: "Successfully signed up",
      accessToken,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};
exports.emailVerification = async (req, res) => {
  try {
    const user = await signupService(req.body);

    const token = user.generateConfirmationToken();

    await user.save({ validateBeforeSave: false });

    const link = `${req.protocol}://${req.get("host")}${
      req.originalUrl
    }/confirmation/${token}`;

    const sendMailBody = {
      email: user?.email,
      subject: "Email Verification",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
          <h1 style="color: #007bff;">Email Verification</h1>
          <p style="font-size: 16px;">Dear ${user?.fullName},</p>
          <p style="font-size: 16px;">Thank you for creating your account. Please click the link below to verify your email:</p>
          <a href=${link} style="display: block; margin-top: 15px; padding: 10px 20px; background-color: #007bff; color: #fff; text-align: center; text-decoration: none; border-radius: 4px;">Verify Email</a>
          <p style="font-size: 16px; margin-top: 10px;">
          If you did not create this account, please ignore this email. Your account will not be activated.
        </p>
          <p style="font-size: 16px;">Best regards,</p>
          <p style="font-size: 16px;">Musfiqeen</p>
        </div>
      `,
    };

    await verifyEmail(sendMailBody);

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

exports.confirmEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await findUserByToken(token);

    if (!user) {
      return res.status(403).json({
        status: "fail",
        error: "Invalid Token",
      });
    }

    const expired = new Date() > new Date(user.confirmationTokenExpire);

    if (expired) {
      return res.status(401).json({
        status: "fail",
        error: "Token expired ",
      });
    }
    user.status = "active";
    user.confirmationToken = undefined;
    user.confirmationTokenExpire = undefined;
    user.save({ validateBeforeSave: false });

    if (user) {
      res.status(200).json({
        status: "success",
        message: "Successfully activated your account",
        data: user,
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: "Account activation failed. Please Try again.",
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

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
      throw new Error("User not found");
    }

    const resetToken = user.generateResetToken();

    await user.save();

    const resetLink = `${req.protocol}://${req.get("host")}${
      req.originalUrl
    }/reset-password/${resetToken}`;

    const sendMailBody = {
      email: user?.email,
      subject: "Reset Account",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
          <h1 style="color: #007bff;">Account Reset</h1>
          <p style="font-size: 16px;">Dear ${user?.fullName},</p>
          <p style="font-size: 16px;">
          We received a request to reset your account password. Please click the link below to reset your password:
          </p>
          <a href=${resetLink} style="display: block; margin-top: 15px; padding: 10px 20px; background-color: #007bff; color: #fff; text-align: center; text-decoration: none; border-radius: 4px;">Reset Password</a>
          <p style="font-size: 16px; margin-top: 10px;">
          If you did not request this password reset, please ignore this email. Your account is secure.
          </p>
          <p style="font-size: 16px;">Best regards,</p>
          <p style="font-size: 16px;">Musfiqeen</p>
          </div>
          `,
    };
    await verifyEmail(sendMailBody);

    res.status(200).json({
      status: "success",
      message: "Reset password link sent to the user's email",
    });
  } catch (error) {
    console.log({ error });
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { resetToken } = req.params;
    const { password } = req.body;

    const user = await resetPasswordByToken(resetToken);

    if (!user) {
      throw new Error("Invalid or expired reset token");
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // Save the updated user
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log({ error });
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};

exports.deleteAllUsers = async (req, res) => {
  try {
    await deleteAll();
    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        status: "fail",
        error: "Please provide your credentials",
      });
    }

    const user = await findUserByEmail(email);

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
    if (user.status != "active") {
      return res.status(401).json({
        status: "fail",
        error: "Your account is not active yet",
      });
    }

    const accessToken = generateToken(user);

    const { password: pwd, ...others } = user.toObject();

    res.status(200).json({
      status: "success",
      message: "Successfully login",
      accessToken,
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
        data: user,
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
