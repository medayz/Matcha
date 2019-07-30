const usersController = require('../../../controllers/usersController');
const express = require('express');
const addRouter = express.Router();

addRouter.use(express.json());

// Add picture
addRouter
    .route('/picture/:username')
    .post(usersController.add.picture);

//	Add tag
addRouter
    .route('/tag/:username')
    .post(usersController.add.tag);

module.exports = addRouter;