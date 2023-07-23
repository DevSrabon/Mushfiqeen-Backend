const express = require("express");
const cors = require("cors");
const app = express();
const users = require("./router/user.router");
const posts = require("./router/post.router");
const bayan = require("./router/bayan.router");
// middleware
app.use(cors());
app.use(express.json());

// Router
app.use("/api/v1/users", users);
app.use("/api/v1/posts", posts);
app.use("/api/v1/bayans", bayan);
// server running
app.get("/", async (req, res) => {
  res.send("Server is running");
});

module.exports = app;
