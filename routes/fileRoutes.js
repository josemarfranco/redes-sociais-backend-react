const express = require("express");

const fileController = require("../controllers/fileController");

const router = express.Router();

router.get("/media/read/:id/:file", fileController.getFile);

module.exports = router;
