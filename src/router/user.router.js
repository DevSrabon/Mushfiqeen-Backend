const express = require("express");
const { signup, login, getToken } = require("../controllers/user.controller");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.get("/jwt", verifyToken, getToken);

module.exports = router;
