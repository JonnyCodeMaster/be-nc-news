const { selectTopics } = require("../2. models/topics.model");


exports.getTopics = (req, res, next) => {
    const { sort_by, order } = req.query;
    selectTopics(sort_by, order).then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
  };