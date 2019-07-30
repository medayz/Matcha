const locationsRouter = require('express').Router();
const locationsController = require('../../controllers/locationsController');

locationsRouter
    .route('/get/:username')
    .get(locationsController.getUserLocations);

module.exports = locationsRouter;