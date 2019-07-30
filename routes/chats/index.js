const chatRouter = require('express').Router();
const chatsController = require('../../controllers/chatsController');

chatRouter
	.route('/get/:username')
	.get(chatsController.getUserChats);

module.exports = chatRouter;