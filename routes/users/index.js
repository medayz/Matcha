const usersRouter = require('express').Router();
const usersController = require('../../controllers/usersController');

usersRouter.use(require('express').json());

usersRouter.use('/add', require('./add'));

usersRouter
	.route('/get')
	.get(usersController.getAllUsers);

usersRouter
	.route('/get/:username')
	.get(usersController.getUserByUsername);

usersRouter
	.route('/get/email/:email')
	.get(usersController.getUserByEmail);

//  Add user
usersRouter
	.route('/create')
	.post(usersController.addUser);

usersRouter
	.route('/auth')
	.post(usersController.connect);

usersRouter
	.route('/activation/:username/:token')
	.get(usersController.accountActivation);

usersRouter
	.use((err, req, res, next) => {
		console.log('error: ' + err.message);
		res.status(400).send('Bad request!');
	});

module.exports = usersRouter;