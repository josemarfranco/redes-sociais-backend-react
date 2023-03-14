const Post = require("../models/postSchema");
const answerPost = require("../models/answerPostSchema");
const fs = require("fs");
const sharp = require("sharp");

const createPost = async (req, res) => {
  if (req.body.content || req.body.image) {
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

const createAnswerPost = async (req, res) => {
  if (req.body.content) {
    const newAnswerPost = new answerPost(req.body);
    newAnswerPost.parentPostId = req.params.id;
    newAnswerPost.save(function (err, cb) {
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
  createAnswerPost,
  deletePost,
};
