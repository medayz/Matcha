const express = require("express");
const router = express.Router();
const paths = require("../config/paths");
const auth = require(`${paths.MIDDLEWARES}/checkToken`);
const profileCompletion = require(`${paths.MIDDLEWARES}/checkUserInfo`);

router.use("/users", require("./users"));
router.use("/tags", require("./tags"));
router.use("/pics", auth, require("./pics"));
router.use("/notifs", auth, require("./notifs"));
router.use("/locations", auth, require("./locations"));
router.use("/chats", auth, profileCompletion, require("./chats"));

module.exports = router;
