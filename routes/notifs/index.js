const notifsRouter = require('express').Router();
const notificationsController = require('../../controllers/notificationsController');

notifsRouter
	.route('/get')
	.get(notificationsController.getAllNotifications);

module.exports = notifsRouter;