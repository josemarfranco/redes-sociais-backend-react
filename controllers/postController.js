const Post = require("../models/postSchema");

const createPost = async (req, res) => {
  try {
    req.body.parentId = res.locals.user.myId;
    const newPost = new Post(req.body);
    await newPost.save();
    res.status(201).send(newPost);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const readPost = async (req, res) => {
  try {
    const id = req.params.id;
    const postsById = await Post.find({ parentId: id });
    res.status(200).send(postsById);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const updatePost = async (req, res) => {
  Post.findByIdAndUpdate(req.params.id, { content: content }, function (error) {
    if (error) {
      res.status(400).send({ message: error.message });
    } else {
      res.status(200).send({ message: "Post atualizado com sucesso" });
    }
  });
};

const deletePost = async (req, res) => {
  Post.findByIdAndDelete(req.params.id, function (error, post) {
    if (error) {
      res.status(400).send({ message: error.message });
    } else if (post !== null) {
      res.status(200).send({ message: "Post removido com sucesso" });
    } else {
      res.status(400).send({ message: "Post inexistente" });
    }
  });
};

module.exports = {
  createPost,
  readPost,
  updatePost,
  deletePost,
};
