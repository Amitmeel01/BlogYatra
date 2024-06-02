const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Ensure the reference name is 'User'
    },
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog", // Ensure the reference name is 'Blog'
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
