const {
  createPostService,
  getPostService,
  findByUserId,
  findByPostId,
  createCommentService,
  getCommentsService,
  createReplyService,
  addCommentLikeService,
} = require("../services/post.service");

exports.createPost = async (req, res) => {
  try {
    await createPostService(req);
    res.status(201).json({
      message: "Post was inserted successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
      message: "There was a server side error!",
    });
  }
};
exports.createLikes = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.userId;
  try {
    const post = await findByPostId(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const user = await findByUserId(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const hasLiked = post.likers.includes(userId);

    if (hasLiked) {
      post.likers = post.likers.filter(
        (likerId) => likerId.toString() !== userId
      );
      post.likes--;
    } else {
      post.likers.push(userId);
      post.likes++;
    }

    await post.save();

    return res
      .status(200)
      .json({ message: "Like status updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "There was a server side error!" });
  }
};

// exports.createLikes = async (req, res) => {
//   try {
//     await likesService(req);
//     res.status(201).json({
//       message: "Likes was updated successfully!",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       error: "There was a server side error!",
// message: error.message;
//     });
//   }
// };

exports.createComment = async (req, res) => {
  try {
    const comments = await createCommentService(req);
    res.status(201).json({
      message: "Comment was inserted successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
      message: "There was a server side error!",
    });
  }
};

exports.getPost = async (req, res) => {
  try {
    const posts = await getPostService(req);
    const { post, count: total } = posts;
    res.status(200).json({
      message: "success",
      data: post,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
      message: "There was a server side error!",
    });
  }
};

exports.getComments = async (req, res) => {
  try {
    const post = await getCommentsService(req);
    res.status(200).json({
      message: "success",
      data: post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
      message: "There was a server side error!",
    });
  }
};

exports.addReplies = async (req, res) => {
  try {
    const comments = await createReplyService(req);
    res.status(201).json({
      message: "Reply was inserted successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
      message: "There was a server side error!",
    });
  }
};

exports.addCommentLikes = async (req, res) => {
  const { postId, commentId } = req.params;
  const userId = req.user.userId;
  try {
    const post = await addCommentLikeService(postId, commentId, userId);
    return res
      .status(201)
      .json({ message: "Comment like/unlike added successfully" });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      message: "There was a server side error!",
    });
  }
};
