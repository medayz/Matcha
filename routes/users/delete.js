const express = require('express');
const addRouter = express.Router();
const paths = require("../../config/paths");
const usersController = require(`${paths.CONTROLLERS}/usersController`);
const uploadMiddleware = require(`${paths.MIDDLEWARES}/upload`);
const imageValidator = require(`${paths.MIDDLEWARES}/imageValidator`);

addRouter.use(express.json());

addRouter
    .route('/picture')
    .post(usersController.delete.picture);

addRouter
    .route('/tag')
    .post(usersController.delete.tag);

module.exports = addRouter;