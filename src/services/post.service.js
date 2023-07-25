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
    // Find the post by its _id
    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post not found");
    }

    // Find the comment within the comments array
    const comment = post.comments.id(commentId);

    if (!comment) {
      throw new Error("Comment not found");
    }

    // Add the reply to the replies array of the comment
    comment.replies.push({
      userId: req.user.userId,
      reply: replyText,
    });

    // Update the commentsLength property
    post.commentsLength = post.comments.length;

    // Save the post to persist the changes
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
  const post = await Post.find({})
    .populate("user", "-password -__v -posts -comments")
    .select("-comments")
    .sort({ createdAt: -1 })
    .skip(parsedSkip)
    .limit(parsedLimit);

  const count = await Post.estimatedDocumentCount();

  return { post, count };
};
exports.getCommentsService = async (req) => {
  const post = await Post.findById(req.params.id)
    .populate("user", "fullName email")
    .populate("comments.userId", "fullName email")
    .populate("comments.replies.userId", "fullName email")
    .lean();
  post.comments.sort((a, b) => b.createdAt - a.createdAt);

  return post;
};
