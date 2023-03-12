const multer = require("multer");
const path = require("path");
const fs = require("fs");

const upload = multer({
  limits: { fileSize: 5000000 },
  fileFilter: function (req, file, cb) {
    let fileExtension = file.originalname
      .split(".")
      [file.originalname.split(".").length - 1].toLowerCase();
    if (["png", "jpg", "jpeg"].indexOf(fileExtension) === -1) {
      cb("INVALIDO", false);
    } else {
      cb(null, true);
    }
  },
  dest: "uploads/tmp/",
});

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
