const express = require("express");
const { getEndpoints } = require("./1. controllers/endpoints.controller");
const { getTopics } = require("./1. controllers/topics.controller");
const {
  getArticles,
  getArticlesByArticleId,
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("./1. controllers/articles.controller");

const app = express();

app.use(express.json());

app.get("/api", getEndpoints);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticlesByArticleId);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "Resource Not Found" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "Bad Request" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "Resource Not Found" });
  } else if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .send({ error: err.message || "Internal Server Error" });
});

module.exports = app;
