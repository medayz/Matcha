const paths = require("../config/paths");
const pictureModel = require(`${paths.MODELS}/pictureModel`);
const tagModel = require(`${paths.MODELS}/tagModel`);

module.exports = async (req, res, next) => {
  try {
    const npics = await pictureModel.countUserPics(req.username);
    const ntags = await tagModel.countUserTags(req.username);

    if (npics && ntags) {
      next();
    } else {
      res.status(403).json({
        status: 403,
        msg: "You must complete your information before you can access this page!"
      });
    }
  } catch (err) {
    console.log(`checkUserInfo middleware: ${err}`);
    next("Something went wrong!");
  }
};
