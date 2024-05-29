const db = require("../db/connection");

exports.selectTopics = () => {
  let sqlQuery = `SELECT * FROM topics`;

  sqlQuery += ";";

  return db.query(sqlQuery).then(({ rows }) => {
    return rows;
  });
};
