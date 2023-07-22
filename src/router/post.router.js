const express = require("express");
const {
  createPost,
  getPost,
  createLikes,
  createComment,
} = require("../controllers/post.controller");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

router.post("/create", verifyToken, createPost);
router.put("/likes/:id", verifyToken, createLikes);
router.get("/get", getPost);
router.post("/comment/:id", verifyToken, createComment);
module.exports = router;
