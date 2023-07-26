const express = require("express");

const verifyToken = require("../middleware/verifyToken");
const { createBayan, getBayan } = require("../controllers/bayan.controller");
const router = express.Router();
router.use(verifyToken);
router.post("/create", createBayan);
router.get("/get/:lang", getBayan);
module.exports = router;
