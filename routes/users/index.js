const paths = require("../../config/paths");
const usersRouter = require("express").Router();
const usersController = require(`${paths.CONTROLLERS}/usersController`);
const auth = require(`${paths.MIDDLEWARES}/checkToken`);

usersRouter.use(require("express").json());

usersRouter.use("/add", auth, require("./add"));
usersRouter.use("/delete", auth, require("./delete"));

usersRouter.route("/get").get(auth, usersController.getPersonalInfos);

usersRouter.route("/isLoggedOn").get(auth, (req, res) => {
  res.send("logged");
});

usersRouter.route("/get/:username").get(usersController.getUserByUsername);

usersRouter.route("/logout").get(usersController.logOut);

usersRouter.route("/edit/infos").put(auth, usersController.edit.infos);

usersRouter.route("/edit/username").put(auth, usersController.edit.username);

usersRouter.route("/edit/password").put(auth, usersController.edit.password);

usersRouter.route("/edit/email").put(auth, usersController.edit.email);

//  Add user
usersRouter.route("/create").post(usersController.addUser);

//  Authentication
usersRouter.route("/auth").post(usersController.connect);

//  E-mail confirmation
usersRouter
  .route("/activation/:username/:token")
  .get(usersController.accountActivation);

module.exports = usersRouter;
