const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const fs = require("fs");
const sharp = require("sharp");

const createUser = async (req, res) => {
  if (
    req.body.email &&
    req.body.name &&
    req.body.surname &&
    req.body.dob &&
    req.body.password &&
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

const readUserMe = async (req, res) => {
  try {
    const myId = res.locals.user.myId;
    const myUserInfo = await User.findById(myId);
    res.status(200).send({
      id: myUserInfo._id,
      name: myUserInfo.name,
      surname: myUserInfo.surname,
      profilePic: myUserInfo.profilePic,
    });
  } catch (error) {
    res.status(50).send({ message: error.message });
  }
};

const readUser = async (req, res) => {
  try {
    const id = req.params.id;
    const userById = await User.findOne({ _id: id });
    res.status(200).send(userById);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  req.body.password = hashedPassword;
  User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    },
    function (error, user) {
      if (error) {
        res.status(400).send({ message: error.message });
      } else {
        res
          .status(200)
          .send({ message: "Usuário atualizado com sucesso", user });
      }
    }
  );
};

const deleteUser = async (req, res) => {
  User.findByIdAndDelete(req.params.id, function (error, user) {
    if (error) {
      res.status(400).send({
        message: error.message,
      });
    } else if (user !== null) {
      res.status(200).send({ message: "Usuário removido com sucesso" });
    } else {
      res.status(400).send({ message: "Usuário inexistente" });
    }
  });
};

module.exports = {
  createUser,
  readUserMe,
  readUser,
  updateUser,
  deleteUser,
};
