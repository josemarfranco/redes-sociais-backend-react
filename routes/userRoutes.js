const express = require("express");

const loginController = require("../controllers/loginController");
const userController = require("../controllers/userController");
const fileController = require("../controllers/fileController");

const router = express.Router();

router.post("/users/create", [
  fileController.profilePicUpload,
  userController.createUser,
]);
router.get("/users/me", [
  loginController.checkAuth,
  userController.readCurrentUser,
]);
router.get("/users/read/:id", [
  loginController.checkAuth,
  userController.readAnyUser,
]);
router.patch("/users/update/:id", [
  loginController.checkAuth,
  userController.updateUser,
]);

module.exports = router;
