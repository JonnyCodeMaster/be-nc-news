const db = require("../db/connection");

exports.selectUsers = () => {
  let sqlQuery = `
  SELECT * 
  FROM users;
  `;

  return db.query(sqlQuery).then(({ rows }) => {
    return rows;
  });
};
