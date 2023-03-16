const Post = require("../models/postSchema");
const answerPost = require("../models/answerPostSchema");
const fs = require("fs");
const sharp = require("sharp");
const maxLength = 300;

const createPost = async (req, res) => {
  if (
    (req.body.content && req.body.content.length <= maxLength) ||
    (req.body.image && req.body.content.length <= maxLength)
  ) {
    const newPost = new Post(req.body);
    newPost.parentId = res.locals.user.myId;
    if (fs.existsSync(req.body.image)) {
      const imagePath = `uploads/${newPost.parentId}/${req.body.fileName}`;
      sharp.cache(false);
      sharp(req.body.image).resize(500, 500).withMetadata().toFile(imagePath);
      newPost.image = `media/read/${newPost.parentId}/${req.body.fileName}`;
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
  if (req.body.content && req.body.content.length <= maxLength) {
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
    res.status(500).send({ message: "Resposta em branco" });
  }
};

const removePost = async (req, res) => {
  Post.findByIdAndDelete(req.params.id, function (err, cb) {
    if (!err) {
      res.status(200).send({ message: "OK" });
    } else {
      res.status(500).send({ message: cb });
    }
  });
};

module.exports = {
  createPost,
  createAnswerPost,
  removePost,
};
