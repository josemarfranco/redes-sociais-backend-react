const Post = require("../models/postSchema");
const fs = require("fs");
const sharp = require("sharp");

const createPost = async (req, res) => {
  if (req.body) {
    const newPost = new Post(req.body);
    newPost.parentId = res.locals.user.myId;
    if (fs.existsSync(req.body.image)) {
      const imagePath = `uploads/${newPost.parentId}/${req.body.fileName}`;
      sharp.cache(false);
      sharp(req.body.image).resize(500, 500).withMetadata().toFile(imagePath);
      newPost.image = imagePath;
    } else {
      newPost.image = "";
    }
    newPost.save(function (err, cb) {
      if (!err) {
        res.status(201).send({ message: "OK" });
      } else {
        res.status(500).send({ message: cb });
      }
    });
  } else {
    res.status(500).send({ message: "Post em branco" });
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
