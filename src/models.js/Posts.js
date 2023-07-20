const mongoose = require("mongoose");
const validator = require("validator");

const postSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    user: { type: mongoose.Types.ObjectId, ref: "User" },
    comments: {
      type: "object",
      properties: {
        commentId: { type: "number" },
        userName: { type: "string" },
        comment: { type: "string" },
      },
    },
    likes: {
      type: Number,
      default: 0,
    },
    likers: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
