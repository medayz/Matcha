const tagsRouter = require('express').Router();
const tagsController = require('../../controllers/tagsController');

tagsRouter
	.route('/get')
	.get(tagsController.getAllTags);

tagsRouter
	.route('/get/:name')
	.get(tagsController.getTagByName);

module.exports = tagsRouter;