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
          friends: {
            $concatArrays: ["$friends", [mongoose.Types.ObjectId(myId)]],
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "friends",
          foreignField: "_id",
          as: "friends",
        },
      },
      {
        $unwind: {
          path: "$friends",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "friends._id",
          foreignField: "parentId",
          as: "friends.posts",
        },
      },
      {
        $unwind: {
          path: "$friends.posts",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "answerposts",
          localField: "friends.posts._id",
          foreignField: "parentPostId",
          as: "friends.posts.answerPosts",
        },
      },
      {
        $unwind: {
          path: "$friends.posts.answerPosts",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          "friends.posts.answerPosts.date": -1,
        },
      },
      {
        $group: {
          _id: "$friends.posts._id",
          name: {
            $first: "$friends.name",
          },
          profilePic: {
            $first: "$friends.profilePic",
          },
          image: {
            $first: "$friends.posts.image",
          },
          content: {
            $first: "$friends.posts.content",
          },
          date: {
            $first: "$friends.posts.date",
          },
          answerPosts: {
            $push: "$friends.posts.answerPosts",
          },
        },
      },
      {
        $match: {
          _id: {
            $ne: null,
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
