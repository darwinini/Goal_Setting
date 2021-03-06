const Comment = require("../models/comment.model");
const Milestone = require("../models/milestone.model");
const jwt = require("jsonwebtoken");

module.exports = {
  findAllComments: (request, response) => {
    Comment.find()
      .then((allComments) => {
        console.log(allComments);
        response.json(allComments);
      })
      .catch((err) => {
        console.log("Find All failed");
        response.status(400).json(err);
      });
  },

  findOneComment: (req, res) => {
    Comment.findOne({ _id: req.params.id })
      .then((oneComment) => {
        console.log(oneComment);
        res.json(oneComment);
      })
      .catch((err) => {
        console.log("Find One failed");
        res.status(400).json(err);
      });
  },

  createComment: (req, res) => {
    const newCommentObject = new Comment(req.body);
    newCommentObject.createdBy = req.jwtpayload.id;

    newCommentObject
      .save()
      .then((newlyCreatedComment) => {
        console.log(newlyCreatedComment);

        // push comment into comments field of user that created it field of goal that it was created for
        Goal.findOneAndUpdate(
          { _id: newlyCreatedComment.createdFor },
          {
            $addToSet: { comments: newlyCreatedComment._id },
          },
          {
            new: true,
            useFindAndModify: true,
          }
        )
          .populate("comment", "body completed createdBy _id")
          .then((goalToUpdate) => {
            console.log(goalToUpdate);
            res.json(newlyCreatedComment);
            User.findOneAndUpdate(
              { _id: newlyCreatedComment.createdBy },
              {
                $addToSet: { comments: newlyCreatedComment._id },
              },
              {
                new: true,
                useFindAndModify: true,
              }
            ).catch((err) => {
              console.log("Create failed");
              console.log("Push to User failed.");
              res.status(400).json(err);
            });
          })
          .catch((err) => {
            console.log("Create failed");
            console.log("Push to goal failed.");
            res.status(400).json(err);
          });
      })
      .catch((err) => {
        console.log("Create failed");
        console.log("Initial creation failed.");
        console.log(err);
        res.status(400).json(err);
      });
  },
  updateComment: (req, res) => {
    Comment.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    })
      .then((updatedComment) => {
        console.log(updatedComment);
        res.json(updatedComment);
      })
      .catch((err) => {
        console.log("Update failed");
        res.status(400).json(err);
      });
  },
  deleteComment: (req, res) => {
    Goal.deleteOne({ _id: req.params.id })
      .then((result) => {
        console.log(result);
        res.json(result);
      })
      .catch((err) => {
        console.log("Delete failed");
        res.status(400).json(err);
      });
  },
};
