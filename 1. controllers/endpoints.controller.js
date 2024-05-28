const { selectEndpoints } = require("../2. models/endpoints.model");

exports.getEndpoints = (req, res, next) => {
  selectEndpoints()
    .then((endpoints) => {
        console.log();
      res.status(200).send({ endpoints: JSON.parse(endpoints) });
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
};
