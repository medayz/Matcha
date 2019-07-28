const 	usersRouter =  require('express').Router();
const	query = require('../../libraries/database');
const	validator = require('../../validators/register');
const	mail = require('../../helpers/sendmail');
const	token = require('../../helpers/token');

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
		fName: req.body.fName ? req.body.fName.trim() : "",
		lName: req.body.lName ? req.body.lName.trim() : "",
		username: req.body.username ? req.body.username.trim() : "",
		email: req.body.email ? req.body.email.trim() : "",
		pass: req.body.pass ? req.body.pass : "",
		cPass: req.body.cPass ? req.body.cPass : "",
	};
	params.err = {
		fName: validator.firstName(params.fName),
		lName: validator.lastName(params.lName),
		username: validator.username(params.username),
		email: validator.email(params.email),
		pass: validator.password(params.pass),
		cPass: validator.confirmPassword(params.pass, params.cPass)
	};
	if (!Object.values(params.err).filter(obj => obj).length) {
		const tok = token.get();
		mail.send({
			receiver: params.email,
			subject: "Confirm your e-mail address",
			body: "message body goes here!",
			html: "<h1>test html</h1><br>here's your token: " + tok
		}).catch(err => console.log(err));
	}
	res.send(params);
});

usersRouter.use((err, req, res, next) => {
	res.status(500).send('Bad request!');
});

module.exports = usersRouter;
