const paths = require("../../config/paths");
const usersRouter = require("express").Router();
const usersController = require(`${paths.CONTROLLERS}/usersController`);
const auth = require(`${paths.MIDDLEWARES}/checkToken`);

usersRouter.use(require("express").json());

usersRouter.use("/add", auth, require("./add"));
usersRouter.use("/delete", auth, require("./delete"));
usersRouter.use("/edit", auth, require("./edit"));

//add just for chat we should change it by getting user matches
usersRouter.route("/getAllUsers").get(usersController.getAllUsers);
usersRouter.route("/get").get(auth, usersController.getPersonalInfos);
usersRouter.route("/get/:username").get(usersController.getUserByUsername);

usersRouter.route("/isLoggedOn").get(auth, (req, res) => res.send("logged"));
usersRouter.route("/logout").get(usersController.logOut);

usersRouter.route("/create").post(usersController.addUser);
usersRouter.route("/auth").post(usersController.connect);
usersRouter
  .route("/activation/:username/:token")
  .get(usersController.accountActivation);
usersRouter
  .route("/filter")
  .post(auth, usersController.filter);


// like
usersRouter.route("/like").post(auth, usersController.like);
// stateOflike
usersRouter.route("/stateOfLike").post(auth, usersController.stateOfLike);

module.exports = usersRouter;


