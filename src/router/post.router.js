const express = require("express");
const { createPost, getPost } = require("../controllers/post.controller");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

router.post("/create", verifyToken, createPost);
router.get("/get", getPost);

module.exports = router;
