const express = require("express");
const {
  createPost,
  getPost,
  createLikes,
} = require("../controllers/post.controller");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

router.post("/create", verifyToken, createPost);
router.put("/likes/:id", verifyToken, createLikes);
router.get("/get", getPost);

module.exports = router;
