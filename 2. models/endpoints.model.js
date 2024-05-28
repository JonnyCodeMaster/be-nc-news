const fs = require("fs/promises");

exports.selectEndpoints = () => {
  return fs.readFile("endpoints.json", "utf8");
};
