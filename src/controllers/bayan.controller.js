const Bayan = require("../models.js/Bayans");

exports.createBayan = async (req, res) => {
  try {
    const post = await Bayan.create({ ...req.body, user: req.user.userId });
    res.status(201).json({
      status: "success",
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

exports.getBayan = async (req, res) => {
  try {
    const get = await Bayan.find({}).populate("user", "fullName email");

    res.status(200).json({
      status: "success",
      data: get,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
      message: "There was a server side error!",
    });
  }
};
