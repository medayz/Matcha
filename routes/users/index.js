const paths = require("../../config/paths");
const usersRouter = require("express").Router();
const usersController = require(`${paths.CONTROLLERS}/usersController`);
const auth = require(`${paths.MIDDLEWARES}/checkToken`);

usersRouter.use(require("express").json());

usersRouter.use("/add", auth, require("./add"));

usersRouter.route("/get").get(auth, usersController.getAllUsers);

usersRouter.route("/get/:username").get(usersController.getUserByUsername);

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

usersRouter.use((err, req, res, next) => {
  console.log(`error: ${err.message}`);
  res.status(400).send("Bad request!");
});

module.exports = usersRouter;
