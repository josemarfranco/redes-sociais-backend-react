const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  profilePic: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  registerDate: {
    type: Date,
    default: Date.now,
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

userSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "parentId",
});

const User = mongoose.model("User", userSchema);

module.exports = User;
