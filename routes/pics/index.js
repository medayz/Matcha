const picsRouter = require('express').Router();
const picturesController = require('../../controllers/picturesController');

picsRouter
    .route('/get/:username')
    .get(picturesController.getUserPics);

module.exports = picsRouter;