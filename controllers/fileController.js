const multer = require("multer");
const upload = multer({ dest: "uploads/tmp/" });
const path = require("path");
const fs = require("fs");

const profilePicUpload = upload.single("profilePic");

const picUpload = upload.single("pic");

const getFile = async (req, res) => {
  try {
    const id = req.params.id;
    const file = req.params.file;
    const filePath = `uploads/${id}/${file}`;
    res.status(200).sendFile(path.resolve(filePath));
  } catch (error) {
    res.status(500).send = {
      message: error.message,
    };
  }
};

const picturePreview = async (req, res) => {
  res.status(200).send({
    filePath: req.file.path,
    fileName: req.file.filename,
  });
};

const removeFromTemp = async (req, res) => {
  fs.rmSync(`uploads/tmp/${req.params.id}`);
  res.status(204).send("OK");
};

module.exports = {
  profilePicUpload,
  picUpload,
  getFile,
  picturePreview,
  removeFromTemp,
};
