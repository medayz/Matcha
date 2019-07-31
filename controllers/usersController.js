const userModel = require('../models/userModel');
const validator = require('../validators/register');
const mail = require('../helpers/sendmail');
const token = require('../helpers/token');

module.exports = {
	getAllUsers: (req, response) => {
		userModel
			.getAllUsers()
			.then(results => {
				response
					.status(200)
					.json({
						status: 200,
						data: results
					});
			}).catch(err => {
				console.log(err.message);
				response
					.status(500)
					.json({
						status: 500,
						msg: 'Error fetching users'
					});
			});
	},
	getUserByUsername: (req, response) => {
		userModel
			.getUser(req.params.username)
			.then(results => {
				response
					.status(200)
					.json({
						status: 200,
						data: results
					});
			})
			.catch(err => {
				console.log(err.message);
				response
					.status(500)
					.json({
						status: 500,
						msg: 'Error getting User by username'
					});
			});
	},
	getUserByEmail: (req, response) => {
		userModel
			.getUserByEmail(req.params.email)
			.then(results => {
				response
					.status(200)
					.json({
						status: 200,
						data: results
					});
			})
			.catch(err => {
				console.log(err.message);
				response
					.status(500)
					.json({
						status: 500,
						msg: 'Error getting User by email'
					});
			});
	},
	addUser: async (req, response) => {
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
		if (!Object.values(params.err).filter(obj => (obj !== "")).length) {
			let newUser = {};
			Object.assign(newUser, params);
			delete newUser.err;
			delete newUser.cPass;
			const tok = token.get();
			newUser.emailToken = tok;
			try {
				await userModel.addUser(newUser);
				response
					.status(200)
					.json({
						status: 200,
						msg: 'Successfully Registered!'
					});
			} catch (err) {
				console.log(err.message);
				response
					.status(500)
					.json({
						status: 500,
						msg: 'Unsuccesful registration, please retry!'
					});
			}
			mail
				.send({
					receiver: params.email,
					subject: "Confirm your e-mail address",
					body: "message body goes here!",
					html: "<h1>test html</h1><br>here's your token: " + tok
				})
				.catch(err => console.log(err));
		} else {
			response
				.status(400)
				.json({
					status: 400,
					data: params
				});
		}
	},
	connect: async (req, response) => {
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
			.then(result => {
				response
					.status(200)
					.json({
						status: 200,
						data: params
					});
			})
			.catch((err) => {
				console.log(`error msg: ${err.message}`);
				if (err.message === "Wrong password!") {
					params.err.pass = err.message;
				} else if (err.message === "Username not registered!") {
					params.err.username = err.message;
				} else {
					params.err.active = err.message;
				}
				response
					.status(400)
					.json({
						status: 400,
						data: params
					});
			});
	},
	accountActivation: async (req, response) => {
		userModel
			.getUser(req.params.username)
			.then(async (result) => {
				if (result.length) {
					result = result[0].props;
					if (result.emailToken === req.params.token) {
						await userModel.removeEmailToken(req.params.username);
						response
							.status(200)
							.json({
								status: 200,
								msg: 'Your Account has been successfully activated!'
							});
					} else {
						throw new Error('Invalid or expired token');
					}
				} else {
					throw new Error('Username not registered');
				}
			})
			.catch(err => {
				console.log(err);
				response
					.status(400)
					.json({
						status: 400,
						msg: err.message
					});
			});
	},
	add: {
		picture: (req, response) => {
			const params = {
				link: req.body.link,
				username: req.params.username,
				date: Date.now()
			};
			userModel
				.add.picture(params)
				.then(() => {
					response
						.status(200)
						.json({
							status: 200,
							msg: 'Picture added'
						});
				})
				.catch((err) => {
					console.log(err.message);
					response
						.status(500)
						.json({
							status: 500,
							msg: 'Picture couldn\'t be added'
						});
				});
		},
		tag: (req, response) => {
			const params = {
				username: req.params.username,
				name: req.body.tagName
			};
			userModel
				.add.tag(params)
				.then(() => {
					response
						.status(200)
						.json({
							status: 200,
							msg: 'Tag added successfully!'
						});
				})
				.catch((err) => {
					console.log(err.message)
					response
						.status(500)
						.json({
							status: 500,
							msg: 'Tag couldn\'t be added!'
						});
				});
		}
	}
};