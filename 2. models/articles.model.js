const db = require("../db/connection");

exports.selectArticlesByArticleId = (article_id) => {
  let sqlQuery = `
      SELECT articles.*, COUNT(comments.article_id) AS comment_count
      FROM articles
      LEFT JOIN comments ON comments.article_id = articles.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;
      `;
  const queryValues = [article_id];

  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Resource Not Found" });
    }
    return rows;
  });
};

exports.selectCommentsByArticleId = (article_id) => {
  let sqlQuery = `
    SELECT *
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;
    `;
  const queryValues = [article_id];

  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Resource Not Found" });
    }
    return rows;
  });
};

exports.insertCommentByArticleId = (article_id, { username, body }) => {
  const sqlQuery = `
    INSERT INTO comments (article_id, author, body, votes, created_at)
    VALUES ($1, $2, $3, 0, NOW())
    RETURNING *;
    `;
  const queryValues = [article_id, username, body];

  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Resource Not Found" });
    }
    return rows[0];
  });
};

exports.updateArticleVotesByArticleId = (article_id, inc_votes) => {
  const sqlQuery = `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;
  `;
  const queryValues = [inc_votes, article_id];

  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Resource Not Found" });
    }
    return rows;
  });
};

exports.selectArticles = (topic) => {
  let queryStr = `
  SELECT articles.author,
articles.title,
articles.article_id,
articles.topic,
articles.created_at,
articles.votes,
articles.article_img_url,
COUNT(comments.article_id) AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
  `;
  const queryParams = [];

  if (topic) {
    queryStr += " WHERE topic = $1";
    queryParams.push(topic);
  }

  queryStr += `
  GROUP BY articles.article_id
  ORDER BY created_at DESC;
  `;

  return db.query(queryStr, queryParams).then(({ rows }) => {
    if (topic && rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Resource Not Found" });
    }
    return rows;
  });
};
