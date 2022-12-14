const express = require("express");

const loginController = require("../controllers/loginController");
const postController = require("../controllers/postController");

const router = express.Router();

router.post("/posts/create", [loginController.checkAuth, postController.createPost])
router.get("/posts/read/:id", [loginController.checkAuth, postController.readPost])
router.patch("/posts/update/:id", [loginController.checkAuth, postController.updatePost])
router.delete("/posts/delete/:id", [loginController.checkAuth, postController.deletePost])

module.exports = router;