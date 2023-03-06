const multer = require("multer");
const upload = multer({ dest: "uploads/tmp/" });
const path = require("path");

const profilePicUpload = upload.single("profilePic");

const getFile = (req, res) => {
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

module.exports = {
  profilePicUpload,
  getFile,
};
