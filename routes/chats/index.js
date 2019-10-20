const chatRouter = require('express').Router();
const chatsController = require('../../controllers/chatsController');

chatRouter
	.route('/get/:username')
	.get(chatsController.getUserChats);

chatRouter
	.route('/getConversation/:sender/:receiver')
	.get(chatsController.getConversation);

chatRouter
	.route('/sendMessage/:receiver/:body')
	.get(chatsController.sendMessage);
module.exports = chatRouter;