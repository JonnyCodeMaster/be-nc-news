const db = require("../db/connection");

exports.selectArticles = (article_id) => {
  let sqlQuery =
    "SELECT articles.author, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes, articles.article_img_url FROM articles WHERE articles.article_id = $1;";
  const queryValues = [article_id];

  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Resource Not Found" });
    }
    return rows;
  });
};
