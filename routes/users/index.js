const 	usersRouter =  require('express').Router();
const	query = require('../../libraries/database');
const	validator = require('../../validators/register.js');

usersRouter.use(require('express').json());

usersRouter.use('/add', require('./add'));

usersRouter.get('/get', (req, res) => {
	query.run('MATCH (n:User) RETURN n;')
		.then((results) => {
			res.json(results);
		});
});

usersRouter.get('/get/:username', (req, res) => {
	query.run('MATCH (n:User {username: $name}) RETURN n;', {name: req.params.username})
		.then((results) => {
			res.json(results);
		});
});

//  Add user
usersRouter.post('/create', (req, res) => {
	const params = {
		fName: req.body.fName.trim(),
		lName: req.body.lName.trim(),
		username: req.body.username.trim(),
		email: req.body.email.trim(),
		pass: req.body.pass,
		cPass: req.body.cPass,
	};
	params.err = {
		fName: validator.firstName(params.fName),
		lName: validator.lastName(params.lName),
		username: validator.username(params.username),
		email: validator.email(params.email),
		pass: '',
		cPass: ''
	};
	res.send(params);
});

module.exports = usersRouter;
