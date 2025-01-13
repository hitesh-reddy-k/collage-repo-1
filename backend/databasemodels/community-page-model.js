const mongoose = require("mongoose");
const User = require("../databasemodels/usermodel");

const PostSchema = new mongoose.Schema({
  Post: {
    type: String,
    required: [true, "Please Enter Post Name"],
    trim: true,
  },
  img: {
    data: Buffer,
    contentType: String,
  },
  likesAndComments: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
      Username:{
        type: String,
      },
      likes: {
        type: Number,
      },
      comment: {
        type: String,
      },
    },
  ],
  likedBy: [{
    type: mongoose.Types.ObjectId,
    ref: "User",
  }],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", PostSchema);
