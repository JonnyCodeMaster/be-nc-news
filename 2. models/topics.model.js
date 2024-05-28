const db = require("../db/connection");


exports.selectTopics = (sort_by = 'description', order = "ASC") => {
    const validSortBy = [
      "description",
      "slug",
    ];
  
    const validOrderBy = ["asc", "ASC", "desc", "DESC"];
  
    if (sort_by && !validSortBy.includes(sort_by)) {
        return Promise.reject({ status: 400, msg: "Invalid Sort Request" });
      }
    
      if (!validOrderBy.includes(order)) {
        return Promise.reject({ status: 400, msg: "Invalid Order Request" });
      }
  
    let sqlQuery = `SELECT * FROM topics`;
  
    if (sort_by) {
      sqlQuery += ` ORDER BY ${sort_by} ${order}`;
    }
  
    sqlQuery += ";";
  
    return db.query(sqlQuery).then(({ rows }) => {
      return rows;
    });
  };