const mongoose = require("mongoose");
const User = require("../models/userSchema");

const generalFeed = async (req, res) => {
  try {
    const myId = res.locals.user.myId;
    const query = await User.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(myId),
        },
      },
      {
        $addFields: {
          feedIds: {
            $concatArrays: ["$friends", [mongoose.Types.ObjectId(myId)]],
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "feedIds",
          foreignField: "_id",
          as: "feedIds",
        },
      },
      {
        $unwind: {
          path: "$feedIds",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "feedIds._id",
          foreignField: "parentId",
          as: "feedIds.posts",
        },
      },
      {
        $unwind: {
          path: "$feedIds.posts",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          _id: "$feedIds.posts._id",
          name: "$feedIds.name",
          profilePic: "$feedIds.profilePic",
          content: "$feedIds.posts.content",
          date: "$feedIds.posts.date",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          profilePic: 1,
          content: 1,
          date: 1,
        },
      },
      {
        $match: {
          _id: {
            $exists: true,
          },
        },
      },
      {
        $sort: {
          date: -1,
        },
      },
    ]);
    res.status(200).send(query);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const feedByUserId = async (req, res) => {
  try {
    const id = req.params.id;
    const query = await User.findById(id).populate("posts");
    res.status(200).send({
      name: query.name,
      profilePic: query.profilePic,
      posts: query.posts,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const peopleCardSuggestion = async (req, res) => {
  try {
    const query = await User.aggregate([
      {
        $project: {
          name: 1,
          surname: 1,
          profilePic: 1,
          bio: 1,
        },
      },
    ]);
    res.status(200).send(query);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  generalFeed,
  feedByUserId,
  peopleCardSuggestion,
};
