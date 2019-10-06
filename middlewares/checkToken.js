const paths = require("../config/paths");
const jwtHelper = require(`${paths.HELPERS}/jwtokens`);
const userModel = require(`${paths.MODELS}/userModel`);

module.exports = (req, res, next) => {
  const token = req.session ? req.session.token : "";

  if (!token) {
    res.status(401).json({
      msg: "No token given! Unautorized!"
    });
  } else {
    jwtHelper
      .checkToken(token)
      .then(async payload => {
        if (!payload.username) throw new Error("Invalid token!");
        let user = await userModel.getUser(payload.username);
        if (!user) {
          res.status(401).json({
            status: 401,
            msg: "Invalid or expired token!"
          });
        } else {
          console.log(user);
          req.username = user.props.username;
          next();
        }
      })
      .catch(err => {
        console.log(`wayli 3la ${err}`);
        res.status(401).json({
          status: 401,
          msg: err.message
        });
      });
  }
};
