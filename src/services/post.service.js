const Post = require("../models.js/Posts");
const User = require("../models.js/Users");

exports.createPostService = async (req) => {
  const newPost = new Post({ ...req.body, user: req.user.userId });

  const post = await newPost.save();
  await User.updateOne(
    { _id: req.user.userId },
    {
      $push: {
        posts: post._id,
      },
    }
  );
  return post;
};

exports.createCommentService = async (req) => {
  const post = await Post.findById(req.params.id);
  const { comment } = req.body;
  post.comments.push({ comment, userId: req.user.userId });
  await post.save();
  await User.updateOne(
    { _id: req.user.userId },
    {
      $push: {
        comments: post._id,
      },
    }
  );
  return post;
};

exports.addCommentLikeService = async (postId, commentId, userId) => {
  try {
    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post not found");
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      throw new Error("Comment not found");
    }

    const userLiked = comment.likes.includes(userId);

    if (userLiked) {
      comment.likes = comment.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      comment.likes.push(userId);
    }

    comment.commentLikes = comment.likes.length;

    await post.save();

    return post;
  } catch (error) {
    throw error;
  }
};

exports.createReplyService = async (req) => {
  const postId = req.params.id;
  const { commentId, replyText } = req.body;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post not found");
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      throw new Error("Comment not found");
    }

    comment.replies.push({
      userId: req.user.userId,
      reply: replyText,
    });

    post.commentsLength = post.comments.length;

    await post.save();

    return post;
  } catch (error) {
    throw error;
  }
};

exports.findByUserId = async (id) => {
  return await User.findById(id);
};
exports.findByPostId = async (id) => {
  return await Post.findById(id);
};

exports.getPostService = async (req) => {
  const parsedLimit = parseInt(req.query.limit);
  const parsedSkip = parseInt(req.query.skip);
  const { id, search } = req?.query; // Added search query

  const query = {};

  if (search) {
    query.user = {
      $in: await User.find({ fullName: { $regex: search, $options: "i" } }),
    }; // Search for users by name
  }
  let post;
  let count;

  try {
    if (id !== "undefined") {
      const { following } = await User.findById(id);
      post = await Post.find({ user: { $in: following } })
        .populate({
          path: "user",
          select: "-password -__v -posts -comments",
        })
        .select("-comments")
        .sort({ createdAt: -1 })
        .skip(parsedSkip)
        .limit(parsedLimit);

      const excludedPosts = await Post.find({ user: { $nin: following } })
        .populate({
          path: "user",
          select: "-password -__v -posts -comments",
        })
        .select("-comments")
        .sort({ createdAt: -1 })
        .skip(parsedSkip)
        .limit(parsedLimit);

      post = post.concat(excludedPosts);
      count = await Post.estimatedDocumentCount();
    } else {
      post = await Post.find(query)
        .populate({
          path: "user",
          select: "-password -__v -posts -comments",
        })
        .select("-comments")
        .sort({ createdAt: -1 })
        .skip(parsedSkip)
        .limit(parsedLimit);

      count = await Post.estimatedDocumentCount();
    }

    return { post, count };
  } catch (err) {
    console.error(err);
    throw new Error("Error fetching posts.");
  }
};

exports.getCommentsService = async (req) => {
  const post = await Post.findById(req.params.id)
    .populate("user", "fullName imageURL designation email followers following")
    .populate("comments.userId", "fullName email imageURL")
    .populate("likers", "fullName imageURL designation")
    .populate("comments.replies.userId", "fullName email imageURL")
    .lean();
  post.comments.sort((a, b) => b.createdAt - a.createdAt);

  return post;
};

exports.updatePostService = async (id, body) => {
  return await Post.findByIdAndUpdate(id, body, { new: true });
};

exports.updateComment = async (postId, commentId, comment) => {
  try {
    const result = await Post.findOneAndUpdate(
      { _id: postId, "comments._id": commentId },
      { $set: { "comments.$.comment": comment } },
      { new: true } // Return the updated document
    );

    if (!result) {
      throw new Error("Comment not found");
    }

    // Update comments length after successful update
    const commentsLength = result.comments.length;
    await result.updateOne({ $set: { commentsLength } });

    return result;
  } catch (error) {
    throw error;
  }
};

exports.updateReplyService = async (
  postId,
  commentId,
  replyId,
  updatedReply
) => {
  try {
    const result = await Post.updateOne(
      {
        _id: postId,
        "comments._id": commentId,
        "comments.replies._id": replyId,
      },
      {
        $set: {
          "comments.$.replies.$[reply].reply": updatedReply,
        },
      },
      {
        arrayFilters: [{ "reply._id": replyId }],
      }
    );

    return result;
  } catch (error) {
    throw error;
  }
};
exports.deleteCommentAndUpdateLengthService = async (postId, commentId) => {
  try {
    const result = await Post.updateOne(
      { _id: postId },
      { $pull: { comments: { _id: commentId } } }
    );

    if (result.modifiedCount > 0) {
      const updatedPost = await Post.findById(postId);
      const commentsLength = updatedPost.comments.length;

      await Post.updateOne({ _id: postId }, { $set: { commentsLength } });
    } else {
      throw new Error("Comment not found");
    }
  } catch (error) {
    throw error;
  }
};

exports.deleteReplyService = async (postId, commentId, replyId) => {
  try {
    const result = await Post.updateOne(
      { _id: postId, "comments._id": commentId },
      { $pull: { "comments.$.replies": { _id: replyId } } }
    );

    return result;
  } catch (error) {
    throw error;
  }
};
exports.deletePostService = async (id) => {
  return await Post.findByIdAndDelete(id);
};
