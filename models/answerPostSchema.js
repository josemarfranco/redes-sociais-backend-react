const mongoose = require("mongoose");

const answerPostSchema = new mongoose.Schema({
  parentPostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  profilePic: {
    type: String,
  },
  name: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const answerPost = mongoose.model("answerPost", answerPostSchema);
module.exports = answerPost;
