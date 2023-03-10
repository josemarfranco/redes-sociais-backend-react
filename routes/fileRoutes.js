const express = require("express");

const fileController = require("../controllers/fileController");

const router = express.Router();

router.get("/media/read/:id/:file", fileController.getFile);
router.post("/media/post", [
  fileController.picUpload,
  fileController.picturePreview,
]);

module.exports = router;
