const express = require('express');
const editRouter = express.Router();
const paths = require("../../config/paths");
const usersController = require(`${paths.CONTROLLERS}/usersController`);

editRouter
    .route("/infos")
    .put(usersController.edit.infos);
editRouter
    .route("/username")
    .put(usersController.edit.username);
editRouter
    .route("/password")
    .put(usersController.edit.password);
editRouter
    .route("/email")
    .put(usersController.edit.email);
editRouter
    .route("/setProfilePicture")
    .put(usersController.edit.picture);

module.exports = editRouter;