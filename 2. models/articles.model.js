const db = require("../db/connection");

exports.selectArticleId = (article_id) => {
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

exports.selectAllArticles = () => {
  const sqlQuery = `
    SELECT 
      articles.author, 
      articles.title, 
      articles.article_id, 
      articles.topic, 
      articles.created_at, 
      articles.votes, 
      articles.article_img_url, 
      COUNT(comments.comment_id) AS comment_count 
    FROM 
      articles 
    LEFT JOIN 
      comments 
    ON 
      articles.article_id = comments.article_id 
    GROUP BY 
      articles.article_id 
    ORDER BY 
      articles.created_at DESC;`;

  return db.query(sqlQuery).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Resource Not Found" });
    }
    return rows;
  });
};
