const tagsRouter = require('express').Router();
const paths = require("../../config/paths");
const tagsController = require(`${paths.CONTROLLERS}/tagsController`);

tagsRouter
	.route('/get')
	.get(tagsController.getAllTags);
tagsRouter
	.route('/get/:username')
	.get(tagsController.getUserTags);
tagsRouter
	.route('/filter/:match')
	.get(tagsController.filterTags);

module.exports = tagsRouter;