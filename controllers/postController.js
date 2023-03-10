const Post = require("../models/postSchema");
const fs = require("fs");

const createPost = async (req, res) => {
  console.log(req.body);
  if (req.body.image) {
    const newPost = new Post(req.body);
    newPost.parentId = res.locals.user.myId;
    if (req.body.image) {
      let imagePath = `uploads/${newPost.parentId}/${req.body.fileName}`;
      fs.renameSync(req.body.image, imagePath);
      newPost.image = imagePath;
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

/*
  if (req.body) {
    const newPost = new Post(req.body);
    newPost.parentId = res.locals.user.myId;
    if (req.file) {
      fs.renameSync(
        `uploads/tmp/${req.file.filename}`,
        `uploads/${newPost.parentId}/${req.file.filename}`
      );
    }
    newPost.save(function (err, cb) {
      if (!err) {
        console.log(newPost);
        res.status(201).send({ message: "OK" });
      } else {
        res.status(500).send({ message: cb });
      }
    });
  } else {
    res.status(500).send({ message: "Post em branco" });
  }
};
*/
