const Post = require("../models/Post");
//const createPath = require('../helpers/create-path');

const handleError = (res, error) => {
  console.log(error);
  res.status(500).json({ message: "Something went wrong!" });
};

const getPost = (req, res) => {
  Post.findById(req.params.id)
    .then((post) => res.status(200).json({ post }))
    .catch((error) => handleError(res, error));
};

const deletePost = (req, res) => {
  Post.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(200);
    })
    .catch((error) => handleError(res, error));
};

const getEditPost = (req, res) => {
  Post.findById(req.params.id)
    .then((post) => res.status(200).json({ post }))
    .catch((error) => handleError(res, error));
};

const editPost = (req, res) => {
  const { title, owner, text } = req.body;
  const { id } = req.params;
  Post.findByIdAndUpdate(id, { title, owner, text })
    .then((result) => res.redirect(`/posts/${id}`))
    .catch((error) => handleError(res, error));
};

const getPosts = (req, res) => {
  Post.find()
    .sort({ createdAt: -1 })
    .then((posts) => res.status(200).json({ posts }))
    .catch((error) => handleError(res, error));
};

const getAddPost = (req, res) => {
  res.render(createPath("add-post"), { title });
};

const addPost = (req, res) => {
  const { title, owner, text } = req.body;
  const post = new Post({ title, owner, text });
  post
    .save()
    .then((result) => res.status(200).json({ result }))
    .catch((error) => handleError(res, error));
};

module.exports = {
  getPost,
  deletePost,
  getEditPost,
  editPost,
  getPosts,
  getAddPost,
  addPost,
};
