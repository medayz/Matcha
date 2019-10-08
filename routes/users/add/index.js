const paths = require("../../../config/paths");
const usersController = require('../../../controllers/usersController');
const upload = require(`${paths.MIDDLEWARES}/upload`);
const express = require('express');
const addRouter = express.Router();

addRouter.use(express.json());

addRouter
    .route('/picture')
    .post(upload, usersController.add.picture);

addRouter
    .route('/tag')
    .post(usersController.add.tag);

addRouter
    .route('/location')
    .post(usersController.add.location);

module.exports = addRouter;