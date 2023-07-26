const mongoose = require("mongoose");
const validator = require("validator");

const postSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },

    user: { type: mongoose.Types.ObjectId, ref: "User" },

    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        comment: {
          type: String,
          required: true,
          trim: true,
          minlength: 2,
          maxlength: 200,
        },
        createdAt: { type: Date, default: Date.now },
        replies: [
          {
            userId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
            },
            reply: {
              type: String,
              required: true,
              trim: true,
              minlength: 2,
              maxlength: 200,
            },
            createdAt: { type: Date, default: Date.now },
          },
        ],
        likes: {
          type: [mongoose.Schema.Types.ObjectId],
          default: [],
          ref: "User",
        },
        commentLikes: {
          type: Number,
          default: 0,
        },
      },
    ],
    commentsLength: {
      type: Number,
      default: 0,
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
postSchema.pre("save", function (next) {
  this.commentsLength = this.comments.length;
  next();
});
const Post = mongoose.model("Post", postSchema);

module.exports = Post;
