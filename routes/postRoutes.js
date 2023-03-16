const express = require("express");

const loginController = require("../controllers/loginController");
const postController = require("../controllers/postController");

const router = express.Router();

router.post("/posts/create", [
  loginController.checkAuth,
  postController.createPost,
]);
router.post("/posts/createAnswer/:id", [
  loginController.checkAuth,
  postController.createAnswerPost,
]);
router.delete("/posts/remove/:id", [
  loginController.checkAuth,
  postController.removePost,
]);

module.exports = router;
