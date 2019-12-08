const paths = require("../../config/paths");
const usersRouter = require("express").Router();
const usersController = require(`${paths.CONTROLLERS}/usersController`);
const auth = require(`${paths.MIDDLEWARES}/checkToken`);
const profileCompletion = require(`${paths.MIDDLEWARES}/checkUserInfo`);

usersRouter.use(require("express").json());

usersRouter.use("/add", auth, require("./add"));
usersRouter.use("/delete", auth, require("./delete"));
usersRouter.use("/edit", auth, require("./edit"));

usersRouter
  .route("/get")
  .get(auth, usersController.getPersonalInfos);
usersRouter
  .route("/get/:username")
  .get(usersController.getUserByUsername);
usersRouter
  .route("/isLoggedOn")
  .get(auth, (req, res) => res.send("logged"));
usersRouter
  .route("/logout")
  .get(auth,usersController.logOut);
usersRouter
  .route("/create")
  .post(usersController.addUser);
usersRouter
  .route("/auth")
  .post(usersController.connect);
usersRouter
  .route("/activation/:username/:token")
  .get(usersController.accountActivation);
usersRouter
  .route("/forgotpwd")
  .post(usersController.getResetPassToken);
usersRouter
  .route("/resetpwd/:username/:token")
  .post(usersController.resetPassword);
usersRouter
  .route("/filter")
  .post(auth, profileCompletion, usersController.filter);
usersRouter
  .route("/search")
  .post(auth, profileCompletion, usersController.search);
usersRouter
  .route("/like")
  .post(auth, profileCompletion, usersController.like);
usersRouter
  .route("/stateOfLike")
  .post(auth, profileCompletion, usersController.stateOfLike);
usersRouter
  .route("/whoami")
  .get(auth, usersController.whoami);
usersRouter
  .route("/completed")
  .get(auth, profileCompletion, usersController.completed);

module.exports = usersRouter;