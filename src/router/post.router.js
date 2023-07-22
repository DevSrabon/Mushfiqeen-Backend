const express = require("express");
const {
  createPost,
  getPost,
  createLikes,
  createComment,
  getComments,
} = require("../controllers/post.controller");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

router.post("/create", verifyToken, createPost);
router.put("/likes/:id", verifyToken, createLikes);
router.get("/get", getPost);
router.put("/comment/:id", verifyToken, createComment);
router.get("/comment/:id", verifyToken, getComments);
module.exports = router;
