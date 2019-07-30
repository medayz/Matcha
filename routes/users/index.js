const 	usersRouter =  require('express').Router();
const	userModel = require('../../models/userModel');
const	validator = require('../../validators/register');
const	mail = require('../../helpers/sendmail');
const	token = require('../../helpers/token');

usersRouter.use(require('express').json());

usersRouter.use('/add', require('./add'));

usersRouter.get('/get', (req, res) => {
	userModel
		.getAllUsers()
		.then(results => res.json(results));
});

usersRouter.get('/get/:username', (req, res) => {
	userModel
		.getUser(req.params.username)
		.then(results => res.json(results));
});

usersRouter.get('/get/email/:email', (req, res) => {
	userModel
		.getUserByEmail(req.params.email)
		.then(results => res.json(results));
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
	console.log(params.err);
	if (!Object.values(params.err).filter(obj => (obj !== "")).length) {
		let	newUser = {};
		Object.assign(newUser, params);
		delete newUser.err;
		delete newUser.cPass;
		const tok = token.get();
		newUser.emailToken = tok;
		console.log(newUser);
		userModel.addUser(newUser);
		mail.send({
			receiver: params.email,
			subject: "Confirm your e-mail address",
			body: "message body goes here!",
			html: "<h1>test html</h1><br>here's your token: " + tok
		}).catch(err => console.log(err));
	}
	res.send(params);
});

usersRouter.post('/auth', async (req, res) => {
	const params = {
		username: req.body.username ? req.body.username.trim() : "",
		pass: req.body.pass ? req.body.pass : "",
		err: {
			active: "",
			username: "",
			pass: ""
		}
	};
	userModel
		.logUser(params)
		.then(result => res.json(params))
		.catch((err) => {
			console.log(`msg: ${err.message}`);
			if (err.message === "Wrong password!") {
				params.err.pass = err.message;
			}	else if (err.message === "Username not registered!") {
				params.err.username = err.message;
			}	else {
				params.err.active = err.message;
			}
			res.json(params);
		});
});

usersRouter.get('/activation/:username/:token', async (req, res) => {
	userModel
		.getUser(req.params.username)
		.then(async (result) => {
			if (result.length) {
				result = result[0].props;
				if (result.emailToken === req.params.token) {
					await userModel.removeEmailToken(req.params.username);
					res.json({
						success: 'Your Account has been successfully activated!'
					});
				}	else {
					throw new Error('Invalid or expired token');
				}
			}	else {
					throw new Error('Username not registered');
			}
		}).catch( err => res.json({err: err.message}) );
});

usersRouter.use((err, req, res, next) => {
	console.log('error: ' + err.message);
	res.status(500).send('Bad request!');
});

module.exports = usersRouter;
