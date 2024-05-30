const {
    removeCommentByCommentId,
  } = require("../2. models/comments.model");

  exports.deleteCommentByCommentId = (req, res, next) => {
    const { comment_id } = req.params;
  
    removeCommentByCommentId(comment_id)
      .then(() => {
        res.status(204).send();
      })
      .catch(err => {
        next(err);
      });
  };