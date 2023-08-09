const express = require("express");
const {
  createPost,
  getPost,
  createLikes,
  createComment,
  getComments,
  addReplies,
  addCommentLikes,
  deletePost,
  updatePost,
} = require("../controllers/post.controller");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

router.get("/get", getPost);
router.use(verifyToken);
router.post("/create", createPost);
router.put("/likes/:id", createLikes);
router.put("/comment/:id", createComment);
router.get("/comment/:id", getComments);
router.put("/:postId/comments/:commentId/like", addCommentLikes);
router.put("/reply/:id", addReplies);
router.put("/update/:id", updatePost);
router.delete("/delete/:id", deletePost);
// router.get("/reply/:id", getComments);
module.exports = router;
