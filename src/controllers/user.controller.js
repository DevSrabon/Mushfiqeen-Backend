const {
  signupService,
  findUserByEmail,
  deleteAll,
  findUserByToken,
  resetPasswordByToken,
  findByJwt,
  findUserById,
} = require("../services/user.service");
const { verifyEmail } = require("../utils/emailVerification");
const { generateToken } = require("../utils/token");

exports.signup = async (req, res) => {
  try {
    const user = await signupService(req.body);
    const token = user.generateConfirmationToken();
    await user.save({ validateBeforeSave: false });

    const sendMailBody = {
      email: user?.email,
      subject: "Email Verification",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
          <h1 style="color: #007bff;">Email Verification</h1>
          <p style="font-size: 16px;">Dear ${user?.fullName},</p>
          <p style="font-size: 16px;">Thank you for creating your account. Please copy the code below and paste it into verify code to verify your email:</p>
          <p style="display: block; margin-top: 15px; padding: 10px 20px; background-color: #007bff; color: #fff; text-align: center; text-decoration: none; border-radius: 4px;">${token}</p>
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
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors).map((value) => value.message);
      return res.status(400).json({
        error: message,
      });
    }

    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};

// exports.emailVerification = async (req, res) => {
//   try {
//     const user = await signupService(req.body);

//     const token = user.generateConfirmationToken();

//     await user.save({ validateBeforeSave: false });

//     const link = `${req.protocol}://${req.get("host")}${
//       req.originalUrl
//     }/confirmation/${token}`;

//     const sendMailBody = {
//       email: user?.email,
//       subject: "Email Verification",
//       html: `
//         <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
//           <h1 style="color: #007bff;">Email Verification</h1>
//           <p style="font-size: 16px;">Dear ${user?.fullName},</p>
//           <p style="font-size: 16px;">Thank you for creating your account. Please click the link below to verify your email:</p>
//           <a href=${link} style="display: block; margin-top: 15px; padding: 10px 20px; background-color: #007bff; color: #fff; text-align: center; text-decoration: none; border-radius: 4px;">Verify Email</a>
//           <p style="font-size: 16px; margin-top: 10px;">
//           If you did not create this account, please ignore this email. Your account will not be activated.
//         </p>
//           <p style="font-size: 16px;">Best regards,</p>
//           <p style="font-size: 16px;">Musfiqeen</p>
//         </div>
//       `,
//     };

//     await verifyEmail(sendMailBody);

//     res.status(200).json({
//       status: "success",
//       message: "Successfully signed up",
//       data: user,
//     });
//   } catch (error) {
//     console.log({ error });
//     res.status(400).json({
//       status: "fail",
//       error: error.message,
//     });
//   }
// };

exports.confirmEmail = async (req, res) => {
  try {
    const { token, email } = req.params;

    const user = await findUserByToken(token, email);

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
      const accessToken = generateToken(user);
      res.status(200).json({
        status: "success",
        message: "Successfully activated your account",
        accessToken,
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

    await user.save({ validateBeforeSave: false });

    // const resetLink = `${req.protocol}://${req.get("host")}${
    //   req.originalUrl
    // }/reset-password/${resetToken}`;

    const sendMailBody = {
      email: user?.email,
      subject: "Reset Account",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
          <h1 style="color: #007bff;">Account Reset</h1>
          <p style="font-size: 16px;">Dear ${user?.fullName},</p>
          <p style="font-size: 16px;">
          We received a request to reset your account password. Please copy the code below and paste it into verify code to reset your password:
          </p>
          <p style="display: block; margin-top: 15px; padding: 10px 20px; background-color: #007bff; color: #fff; text-align: center; text-decoration: none; border-radius: 4px;">${resetToken}</a>
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
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors).map((value) => value.message);
      return res.status(400).json({
        error: message,
      });
    }
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
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });
    const accessToken = generateToken(user);
    res.status(200).json({
      status: "success",
      message: "Password reset successfully",
      accessToken,
    });
  } catch (error) {
    console.log({ error });
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
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
    if (user.status === "inactive") {
      const token = await user.generateConfirmationToken();
      await user.save({ validateBeforeSave: false });
      const sendMailBody = {
        email: user?.email,
        subject: "Email Verification",
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
            <h1 style="color: #007bff;">Email Verification</h1>
            <p style="font-size: 16px;">Dear ${user?.fullName},</p>
            <p style="font-size: 16px;">Thank you for creating your account. Please copy the code below and paste it into verify code to verify your email:</p>
            <p style="display: block; margin-top: 15px; padding: 10px 20px; background-color: #007bff; color: #fff; text-align: center; text-decoration: none; border-radius: 4px;">${token}</p>
            <p style="font-size: 16px; margin-top: 10px;">
            If you did not create this account, please ignore this email. Your account will not be activated.
          </p>
            <p style="font-size: 16px;">Best regards,</p>
            <p style="font-size: 16px;">Musfiqeen</p>
          </div>
        `,
      };
      await verifyEmail(sendMailBody);
      return res.status(402).json({
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
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors).map((value) => value.message);
      return res.status(400).json({
        error: message,
      });
    }
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};

exports.getToken = async (req, res) => {
  try {
    const { email } = req.user;

    const user = await findByJwt(email);
    if (user) {
      res.status(200).json({
        status: "success",
        data: user,
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
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        status: "error",
        error: "User Not Found",
      });
    }
    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const user = await findUserById(id, body);
    if (!user) {
      return res.status(404).json({
        status: "error",
        error: "User Not Found",
      });
    }
    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.addFollower = async (req, res) => {
  const { userIdToFollow } = req.params;
  const currentUserId = req.user.userId;

  try {
    if (currentUserId === userIdToFollow) {
      return res.status(400).json({ message: "You cannot follow yourself." });
    }

    const currentUser = await findUserById(currentUserId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found." });
    }

    const userToFollow = await findUserById(userIdToFollow);
    if (!userToFollow) {
      return res.status(404).json({ message: "User to follow not found." });
    }

    await currentUser.followUser(userIdToFollow);
    await userToFollow.addFollower(currentUserId);

    res.status(200).json({ message: "Successfully followed the user." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
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
