const express = require("express");
const {
  createPost,
  getPost,
  createLikes,
  createComment,
  getComments,
  addReplies,
  addCommentLikes,
} = require("../controllers/post.controller");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

router.get("/get", getPost);
router.post("/create", verifyToken, createPost);
router.put("/likes/:id", verifyToken, createLikes);
router.put("/comment/:id", verifyToken, createComment);
router.put("/:postId/comments/:commentId/like", verifyToken, addCommentLikes);
router.put("/reply/:id", verifyToken, addReplies);
router.get("/reply/:id", verifyToken, getComments);
module.exports = router;
