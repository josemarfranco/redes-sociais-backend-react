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
          parentId: {
            $first: "$friends._id",
          },
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

const anyUserFeed = async (req, res) => {
  try {
    const anyUserId = req.params.id;
    const query = await User.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(anyUserId),
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "parentId",
          as: "posts",
        },
      },
      {
        $unwind: {
          path: "$posts",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "answerposts",
          localField: "posts._id",
          foreignField: "parentPostId",
          as: "posts.answerPosts",
        },
      },
      {
        $sort: {
          "posts.answerPosts.date": -1,
        },
      },
      {
        $group: {
          _id: "$posts._id",
          parentId: {
            $first: "$_id",
          },
          name: {
            $first: "$name",
          },
          profilePic: {
            $first: "$profilePic",
          },
          image: {
            $first: "$posts.image",
          },
          content: {
            $first: "$posts.content",
          },
          date: {
            $first: "$posts.date",
          },
          answerPosts: {
            $push: "$posts.answerPosts",
          },
        },
      },
      {
        $unwind: {
          path: "$answerPosts",
          preserveNullAndEmptyArrays: true,
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

const peopleCardSuggestion = async (req, res) => {
  const myId = res.locals.user.myId;
  try {
    const query = await User.aggregate([
      {
        $match: {
          _id: {
            $ne: mongoose.Types.ObjectId(myId),
          },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          surname: 1,
          profilePic: 1,
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
  anyUserFeed,
  peopleCardSuggestion,
};
