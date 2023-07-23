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

// exports.likesService = async (req) => {
//   return await Post.findOneAndUpdate(
//     { _id: req.params.id },
//     { $inc: { likes: 1 } }
//   );
// };

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
    .populate("user", "-password -__v -posts -comments")
    .populate("comments.userId", "-password -__v -posts -comments")
    .lean();
  post.comments.sort((a, b) => b.createdAt - a.createdAt);

  return post;
};
