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
  updateUser,
  addFollower,
} = require("../controllers/user.controller");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

router.post("/signup", signup);

router.get("/confirm/:email/code/:token", confirmEmail);

router.post("/login", login);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:resetToken", resetPassword);

router.get("/jwt", verifyToken, getToken);

router.get("/getUser/:id", getUser);

router.put("/update-user/:id", updateUser);

router.post("/add-follow/:userIdToFollow", verifyToken, addFollower);

router.delete("/delete", deleteAllUsers);

module.exports = router;
