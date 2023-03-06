const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const fs = require("fs");

const createUser = async (req, res) => {
  try {
    const profilePic = req.file.filename;
    req.body.profilePic = profilePic;
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    const newUser = new User(req.body);
    if (!(await User.findOne({ email: req.body.email }))) {
      fs.mkdir(`uploads/${newUser._id}`, function (error) {
        console.log(error);
      });
      fs.rename(
        `uploads/tmp/${profilePic}`,
        `uploads/${newUser._id}/${newUser._id}`,
        function (error) {
          console.log(error);
        }
      );
      await newUser.save();
      await User.updateOne(
        { _id: newUser._id },
        { profilePic: `/media/read/${newUser._id}/${newUser._id}` }
      );
      res.status(201).send({ message: "Usuário criado com sucesso" });
    } else {
      fs.unlink(`uploads/tmp/${profilePic}`, function (error) {
        console.log(error);
      });
      res.status(400).send({ message: `Email ${newUser.email} já cadastrado` });
    }
  } catch (error) {
    res.status(400).send({
      message: error.message,
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
