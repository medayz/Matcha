const tagsRouter = require('express').Router();
const tagsController = require('../../controllers/tagsController');

tagsRouter
	.route('/get')
	.get(tagsController.getAllTags);

tagsRouter
	.route('/get/:name')
	.get(tagsController.getTagByName);

tagsRouter
	.route('/get/:username')
	.get(tagsController.getUserTags);

tagsRouter
	.route('/filter/:match')
	.get(tagsController.filterTags);

module.exports = tagsRouter;