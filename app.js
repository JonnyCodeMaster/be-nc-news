const express = require("express");
const { getTopics } = require("./1. controllers/topics.controller");

const app = express();

app.get("/api/topics", getTopics);

app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "Resource Not Found" });
});

app.use((err, req, res, next) => {
  const psqlErrorCodes = ["22P02", "23502", "23503"];
  if (psqlErrorCodes.includes(err.code)) {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status === 500) {
    res.status(500).send({ msg: "Internal Server Error" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
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
