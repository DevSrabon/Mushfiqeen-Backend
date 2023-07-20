const Post = require("../models.js/Posts");
const User = require("../models.js/Users");

exports.createPost = async (req, res) => {
  try {
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
    res.status(200).json({
      message: "Post was inserted successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "There was a server side error!",
    });
  }
};
exports.getPost = async (req, res) => {
  try {
    const post = await Post.find({}).populate("user", "-password");
    res.status(200).json({
      message: "success",
      data: post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "There was a server side error!",
    });
  }
};
