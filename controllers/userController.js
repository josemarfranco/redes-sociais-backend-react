const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const fs = require("fs");
const sharp = require("sharp");

const createUser = async (req, res) => {
  if (
    req.body.email &&
    req.body.email.length <= 100 &&
    req.body.name &&
    req.body.name.length <= 30 &&
    req.body.surname &&
    req.body.surname.length <= 30 &&
    req.body.dob &&
    req.body.password &&
    req.body.password.length <= 100 &&
    req.body.passwordConf.length <= 100 &&
    req.body.password === req.body.passwordConf
  ) {
    const newUser = new User(req.body);
    const newUserFolder = `uploads/${newUser._id}`;
    newUser.password = bcrypt.hashSync(req.body.password, 10);
    fs.mkdirSync(newUserFolder);
    if (fs.existsSync(req.body.profilePic)) {
      const imagePath = `uploads/${newUser._id}/${newUser._id}`;
      sharp.cache(false);
      sharp(req.body.profilePic)
        .resize(500, 500)
        .withMetadata()
        .toFile(imagePath);
      newUser.profilePic = `/media/read/${newUser._id}/${newUser._id}`;
    } else {
      newUser.profilePic = "";
    }
    newUser.save(function (err) {
      if (!err) {
        res.status(201).send({ message: "OK" });
      } else {
        fs.rmSync(newUserFolder, { recursive: true });
        res.status(500).send({ message: "Usuário já existente" });
      }
    });
  } else {
    res.status(500).send({
      message: "Campo(s) vazio(s) ou senhas não conferem",
    });
  }
};

const readCurrentUser = async (req, res) => {
  try {
    const myId = res.locals.user.myId;
    const myUserInfo = await User.findById(myId).populate("posts");
    res.status(200).send({
      id: myUserInfo._id,
      name: myUserInfo.name,
      surname: myUserInfo.surname,
      profilePic: myUserInfo.profilePic,
      friends: myUserInfo.friends,
      friendsLen: myUserInfo.friends.length,
      postsLen: myUserInfo.posts.length,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const readAnyUser = async (req, res) => {
  try {
    const id = req.params.id;
    const userById = await User.findOne({ _id: id });
    res.status(200).send({
      id: userById._id,
      name: userById.name,
      surname: userById.surname,
      profilePic: userById.profilePic,
      friends: userById.friends,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, function (err, cb) {
    if (err) {
      res.status(400).send({ message: err.message });
    } else {
      res.status(200).send({ message: cb });
    }
  });
};

module.exports = {
  createUser,
  readCurrentUser,
  readAnyUser,
  updateUser,
};
