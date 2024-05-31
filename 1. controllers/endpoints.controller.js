const fs = require("fs/promises");

exports.getEndpoints = (req, res, next) => {
    return fs.readFile("endpoints.json", "utf8")
    .then((endpoints) => {
      res.status(200).send({ endpoints: JSON.parse(endpoints) });
    })
    .catch((err) => {
      next(err);
    });
};
