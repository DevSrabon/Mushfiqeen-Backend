const express = require("express");
const {
  signup,
  login,
  getToken,
  confirmEmail,
  deleteAllUsers,
  forgotPassword,
  resetPassword,
  getUser,
} = require("../controllers/user.controller");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

router.post("/signup", signup);

router.get("/signup/confirmation/:token", confirmEmail);

router.post("/login", login);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:resetToken", resetPassword);

router.get("/jwt", verifyToken, getToken);

router.get("/getUser/:email", getUser);

router.delete("/delete", deleteAllUsers);

module.exports = router;
