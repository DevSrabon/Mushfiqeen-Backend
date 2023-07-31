const express = require("express");

const verifyToken = require("../middleware/verifyToken");
const { createBayan, getBayan } = require("../controllers/bayan.controller");
const router = express.Router();
router.get("/get/:lang", getBayan);
router.use(verifyToken);
router.post("/create", createBayan);
module.exports = router;
