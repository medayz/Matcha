const fetch = require("node-fetch");
const paths = require("../config/paths");
const jwtHelper = require(paths.HELPERS + "/jwtokens");

module.exports = (req, res, next) => {
  // const token = req.header("auth-token");
  const token = req.session.token;

  console.log(req.cookies);
  console.log(token);
  if (!token) {
    res.status(401).json({
      msg: "No token given! Unautorized!"
    });
  } else {
    jwtHelper
      .checkToken(token)
      .then(async payload => {
        if (!payload.username) throw new Error("Invalid token!");
        let user = await fetch(
          `http://localhost:1337/api/users/get/${payload.username}`
        );
        user = await user.json();
        if (!user) {
          res.status(401).json({
            status: 401,
            msg: "Invalid or expired token!"
          });
        } else {
          req.username = user.data.props.username;
          next();
        }
      })
      .catch(err => {
        res.status(401).json({
          status: 401,
          msg: err.message
        });
      });
  }
};
