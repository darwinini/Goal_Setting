const mongoose = require("mongoose");

const GoalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Goal Title is required."],
      minlength: [2, "Title must be at least 2 characters long."],
    },
    completed: {
      type: Boolean,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    milestones: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Milestone",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Goal = mongoose.model("Goal", GoalSchema);

module.exports = Goal;
