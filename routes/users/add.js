const express = require('express');
const addRouter = express.Router();
const paths = require("../../config/paths");
const usersController = require(`${paths.CONTROLLERS}/usersController`);
const uploadMiddleware = require(`${paths.MIDDLEWARES}/upload`);
const imageValidator = require(`${paths.MIDDLEWARES}/imageValidator`);

addRouter.use(express.json());

addRouter
    .route('/picture')
    .post(uploadMiddleware, imageValidator, usersController.add.picture);

addRouter
    .route('/tag')
    .post(usersController.add.tag);

addRouter
    .route('/location')
    .post(usersController.add.location);

addRouter
    .route('/view')
    .post(usersController.add.view);

addRouter
    .route('/block')
    .post(usersController.add.block);

addRouter
    .route('/report')
    .post(usersController.add.report);

module.exports = addRouter;
