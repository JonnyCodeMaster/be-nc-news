const { selectArticles } = require("../2. models/articles.model");

exports.getArticles = (req, res, next) => {
  const { article_id } = req.query;

  if (!article_id || isNaN(article_id)) {
    return res.status(400).send({ msg: "Bad Request" });
  }

  selectArticles(article_id)
    .then((articles) => {
      if (articles.length === 0) {
        return res.status(404).send({ msg: "Resource Not Found" });
      }
      res.status(200).send({ article: articles[0] });
    })
    .catch((err) => {
      next(err);
    });
};
