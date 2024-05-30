const {
  selectArticles,
  selectArticlesByArticleId,
  selectCommentsByArticleId,
  insertCommentByArticleId,
  updateArticleVotesByArticleId,
} = require("../2. models/articles.model");

exports.getArticles = (req, res, next) => {
  const { topic } = req.query;
  selectArticles(topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticlesByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectArticlesByArticleId(article_id)
    .then((article) => {
      res.status(200).send({ article: article[0] });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  insertCommentByArticleId(article_id, { username, body })
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(err => {
      next(err);
    });
};

exports.patchArticleVotesByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  updateArticleVotesByArticleId(article_id, inc_votes)
    .then(article => {
      res.status(200).send(article[0]);
    })
    .catch(err => {
      next(err);
    });
};