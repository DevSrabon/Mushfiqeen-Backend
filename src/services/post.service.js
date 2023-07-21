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

exports.getPostService = async () => {
  return await Post.find({})
    .populate("user", "-password -__v")
    .populate("likers", "-password -__v")
    .sort({ createdAt: -1 });
};
