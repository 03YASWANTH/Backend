const jwt = require("jsonwebtoken");
require("dotenv").config({
  path: "../.env",
});

const authenticateUser = (role) => {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (token) {
        jwt.verify(token, process.env.SECRET_KEY, (err, data) => {
          if (err) {
            res.status(401).send({ success: false, message: "Session expired!" });
            return;
          }

          if (data && data.role === role) {
            req.user = data;
            next();
          } else {
            res.status(403).send({ success: false, message: "Access denied!" });
            return;
          }
        });
      } else {
        res.status(401).send({ success: false, message: "Sign in to get access!" });
        return;
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ success: false, message: "Something went wrong!" });
    }
  };
};

module.exports = {
  authenticateAdmin: authenticateUser("admin"),
  authenticateCounselor: authenticateUser("counselor"),
};
