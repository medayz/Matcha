const notifsRouter = require('express').Router();
const notificationsController = require('../../controllers/notificationsController');

notifsRouter
	.route('/get')
	.get(notificationsController.getAllNotifications);
notifsRouter
	.route('/read')
	.post(notificationsController.readNotif);
module.exports = notifsRouter;