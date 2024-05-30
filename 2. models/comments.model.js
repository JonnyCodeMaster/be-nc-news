const db = require("../db/connection");

exports.removeCommentByCommentId = (comment_id) => {
    const sqlQuery = `
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *;
    `;
    const queryValues = [comment_id];
  
    return db.query(sqlQuery, queryValues).then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Resource Not Found" });
      }
      return rows;
    });
  };