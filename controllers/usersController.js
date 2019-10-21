const paths = require("../config/paths");
const jwtHelper = require(`${paths.HELPERS}/jwtokens`);
const userModel = require(`${paths.MODELS}/userModel`);
const chatModel = require(`${paths.MODELS}/chatModel`);
const pictureModel = require(`${paths.MODELS}/pictureModel`);
const tagModel = require(`${paths.MODELS}/tagModel`);
const validator = require(`${paths.HELPERS}/validator`);
const mail = require(`${paths.HELPERS}/sendmail`);
const token = require(`${paths.HELPERS}/token`);
const fs = require('fs');

module.exports = {
	whoami: async (req, response) => {
		response.status(200).json({
			user: req.username
		});
	},
	getAllUsers: async (req, response) => {
		userModel
			.getAllUsers()
			.then(results => {
				response.json({
					status: 200,
					data: results
				});
			})
			.catch(err => {
				console.log(err.message);
				response.status(500).json({
					status: 500,
					msg: "Error fetching users"
				});
			});
	},
	getPersonalInfos: (req, response) => {
		userModel
			.getUser(req.username)
			.then(results => {
				let {
					lName,
					fName,
					username,
					email,
					country,
					city
				} = results.props;
				results = {
					username: username,
					fName: fName,
					lName: lName,
					email: email,
					country: country,
					city: city
				};
				if (results) {
					response.json({
						status: 200,
						data: results
					});
				}
			})
			.catch(err => {
				console.log(err.message);
				next("Error getting your personal info");
			});
	},
	getUserByUsername: (req, response) => {
		userModel
			.getUser(req.params.username)
			.then(results => {
				let { lName, fName, username, country, city } = results.props;
				results = {
					username: username,
					fName: fName,
					lName: lName,
					country: country,
					city: city
				};
				if (results) {
					response.json({
						status: 200,
						data: results
					});
				} else {
					response.status(404).json({
						status: 404,
						msg: "User Not Found!"
					});
				}
			})
			.catch(err => {
				console.log(err.message);
				response.status(500).json({
					status: 500,
					msg: "Error getting User by username"
				});
			});
	},
	getUserByEmail: (req, response) => {
		userModel
			.getUserByEmail(req.params.email)
			.then(results => {
				if (results.length) {
					response.json({
						status: 200,
						data: results
					});
				} else {
					response.status(404).json({
						status: 404,
						msg: "User Not Found!"
					});
				}
			})
			.catch(err => {
				console.log(err.message);
				response.status(500).json({
					status: 500,
					msg: "Error getting User by email"
				});
			});
	},
	addUser: async (req, response) => {
		const params = {
			fName: req.body.fName || "",
			lName: req.body.lName || "",
			username: req.body.username || "",
			birthDate: req.body.birthDate || "",
			email: req.body.email || "",
			pass: req.body.pass || "",
			cPass: req.body.cPass || ""
		};
		params.err = {
			fName: validator.firstName(params.fName),
			lName: validator.lastName(params.lName),
			username: validator.username(params.username),
			birthDate: validator.birthDate(params.email),
			email: validator.email(params.email),
			pass: validator.password(params.pass),
			cPass: validator.confirmPassword(params.pass, params.cPass)
		};
		if (!Object.values(params.err).filter(obj => obj !== "").length) {
			let newUser = {};
			Object.assign(newUser, params);
			delete newUser.err;
			delete newUser.cPass;
			const tok = token.get();
			newUser.emailToken = tok;
			try {
				await userModel.addUser(newUser);
				response.json({
					status: 200,
					msg: "Successfully Registered!"
				});
			} catch (err) {
				console.log(err.message);
				response.status(500).json({
					status: 500,
					msg: "Unsuccesful registration, please retry!"
				});
			}
			mail.send({
				receiver: params.email,
				subject: "Confirm your e-mail address",
				body: "message body goes here!",
				html: `<h1>You can activate your account from <a href="http:/localhost:3000/confirmAcc/${params.username}/${tok}">here</a></h1>`
			}).catch(err => console.log(err));
		} else {
			response.status(400).json({
				status: 400,
				data: params
			});
		}
	},
	connect: async (req, response) => {
		const errors = [
			"Wrong password!",
			"Your account's still not activated, please confirm your e-mail address!",
			"Something went wrong, please retry!"
		];
		const params = {
			username: req.body.username ? req.body.username.trim() : "",
			pass: req.body.pass ? req.body.pass : "",
			err: {
				active: "",
				username: "",
				pass: ""
			}
		};
		if (params.username) {
			if (await userModel.getUser(params.username)) {
				userModel
					.checkUserPwd(params)
					.then(result => {
						const token = jwtHelper.getToken({
							username: params.username
						});
						req.session.token = token;
						response
							// .cookie("token", token, { httpOnly: true })
							.sendStatus(200);
					})
					.catch(err => {
						if (err.message != -1 && err.message != -2) {
							response.status(500).json({
								status: 500,
								msg: errors[2]
							});
						} else {
							params.err.active =
								err.message == -1 ? errors[1] : "";
							params.err.pass =
								err.message == -2 ? errors[0] : "";
							response.status(400).json({
								status: 400,
								data: params
							});
						}
						console.log(`error msg: ${err.message}`);
					});
			} else {
				params.err.username = "Username not registered";
				response.status(400).json({
					status: 400,
					data: params
				});
			}
		} else {
			params.err.username = "Username not registered";
			response.status(400).json({
				status: 400,
				data: params
			});
		}
	},
	logOut: async (req, response) => {
		req.session.destroy(function(err) {
			if (err) {
				console.log(err);
			} else {
				response.clearCookie("session").sendStatus(200);
			}
		});
	},
	accountActivation: async (req, response) => {
		userModel
			.getUser(req.params.username)
			.then(async result => {
				if (result) {
					result = result.props;
					if (result.emailToken === req.params.token) {
						const setActive = userModel.setUserActive(
							req.params.username
						);
						const rmToken = userModel.removeEmailToken(
							req.params.username
						);
						await Promise.all([setActive, rmToken]);
						response.json({
							status: 200,
							msg: "Your Account has been successfully activated!"
						});
					} else {
						throw new Error("Invalid or expired token");
					}
				} else {
					throw new Error("Username not registered");
				}
			})
			.catch(err => {
				response.status(400).json({
					status: 400,
					msg: err.message
				});
			});
	},
	add: {
		picture: async (req, res, next) => {
			const params = {
				username: req.username,
				filename: req.file.filename,
				isProfilePic: req.body.isProfilePic
			};
			try {
				const npics = await pictureModel.countUserPics(params.username);
				if (npics === 4) {
					const err = new Error("You can't upload more than 4 pictures");
					err.status = 400;
				}
				if (params.isProfilePic === "true")
				{
					let deleteObj = {
						username: req.username
					}
					userModel.delete.picture(deleteObj);
				}
				await userModel.add.picture(params)
				res.status(200).json({
					status: 200,
					msg: "Image modified !",
					img: params
				});
			}	catch(e) {
				!e.message && (e.message = "Something Went Wrong!");
				next(e);
			}
		},
		tag: (req, response) => {
			const params = {
				username: req.username,
				name: req.body.tagName
			};
			userModel.add
				.tag(params)
				.then(() => {
					response.json({
						status: 200,
						msg: "Tag added successfully!"
					});
				})
				.catch(err => {
					console.log(err.message);
					response.status(500).json({
						status: 500,
						msg: "Tag couldn't be added!"
					});
				});
		},
		location: (req, response) => {
			const params = {
				username: req.username,
				long: req.body.long || null,
				lat: req.body.lat || null,
				country: req.body.country || "",
				city: req.body.city || ""
			};
			userModel.add
				.location(params)
				.then(() => {
					response.json({
						status: 200,
						msg: "Location added successfully!"
					});
				})
				.catch(err => {
					console.log(err.message);
					response.status(500).json({
						status: 500,
						msg: "Location couldn't be added!"
					});
				});
		}
	},
	filter: (req, response, next) => {
		const	params = {
			username: req.username,
			distance: req.body.distance || 10,
			ageMin: req.body.ageMin || 18,
			ageMax: req.body.ageMax || 25,
			tags: req.body.tags || 0
		};
		userModel
			.filterUsers(params)
			.then(res => {
				response.json({
					status: 200,
					data: res
				});
			}).catch(err => {console.log(err); next("Something Went Wrong!");});
	},
	edit: {
		infos: (req, response) => {
			const params = {
				fName: req.body.fName ? req.body.fName.trim() : "",
				lName: req.body.lName ? req.body.lName.trim() : "",
				gender: req.body.gender ? req.body.gender.trim() : "",
				sexualPref: req.body.sexualPref
					? req.body.sexualPref.trim()
					: "",
				bio: req.body.bio ? req.body.bio.trim() : "",
				birthDate: req.body.birthDate
			};
			params.err = {
				fName: validator.firstName(params.fName),
				lName: validator.lastName(params.lName)
			};
			if (!Object.values(params.err).filter(obj => obj !== "").length) {
				userModel.edit
					.infos(req.username, params)
					.then(res => {
						response.json({
							status: 200,
							msg: "Infos Successfully updated!"
						});
					})
					.catch(err => {
						console.log(err.message);
						response.status(500).json({
							status: 500,
							msg: "Infos could not be changed!"
						});
					});
			} else {
				response.status(400).json({
					status: 400,
					data: params
				});
			}
		},
		username: async (req, response) => {
			const params = {
				newUsername: req.body.newUsername
					? req.body.newUsername.trim()
					: ""
			};
			params.err = {
				newUsername: validator.username(
					params.newUsername,
					await userModel.getUser(params.newUsername)
				)
			};
			if (!Object.values(params.err).filter(errMsg => errMsg).length) {
				userModel.edit
					.username(req.username, params.newUsername)
					.then(res => {
						response.json({
							status: 200,
							msg: "Username Successfully updated!"
						});
					})
					.catch(err => {
						console.log(err.message);
						response.status(500).json({
							status: 500,
							msg: "Username could not be changed!"
						});
					});
			} else {
				response.status(400).json({
					status: 400,
					data: params
				});
			}
		},
		password: async (req, response) => {
			const params = {
				username: req.username ? req.username.trim() : "",
				pass: req.body.pass ? req.body.pass : "",
				newPass: req.body.newPass ? req.body.newPass : "",
				cPass: req.body.cPass ? req.body.cPass : ""
			};
			params.err = {
				pass: "",
				newPass: validator.password(params.newPass),
				cPass: validator.confirmPassword(params.newPass, params.cPass)
			};
			userModel
				.checkUserPwd(params)
				.then(async result => {
					try {
						if (
							!Object.values(params.err).filter(errMsg => errMsg)
								.length
						) {
							await userModel.edit.password(
								params.username,
								params.newPass
							);
							response.json({
								status: 200,
								msg: "Password changed successfully!"
							});
						} else {
							response.status(400).json({
								status: 400,
								data: params
							});
						}
					} catch (err) {
						console.log(err.message);
						response.status(500).json({
							status: 500,
							msg: "password couldn't be changed !"
						});
					}
				})
				.catch(err => {
					if (err.message != -2) {
						response.status(500).json({
							status: 500,
							msg: "Something went wrong, please retry!"
						});
					} else {
						params.err.pass = "Wrong Password!";
						response.status(400).json({
							status: 400,
							data: params
						});
					}
					console.log(`error msg: ${err.message}`);
				});
		},
		email: async (req, response) => {
			const params = {
				newEmail: req.body.newEmail ? req.body.newEmail.trim() : ""
			};
			params.err = {
				newEmail: validator.email(
					params.newEmail,
					await userModel.getUserByEmail(params.newEmail)
				)
			};
			if (!Object.values(params.err).filter(errMsg => errMsg).length) {
				userModel.edit
					.email(req.username, params.newEmail)
					.then(res => {
						response.json({
							status: 200,
							msg: "E-mail address Successfully updated!"
						});
					})
					.catch(err => {
						console.log(err.message);
						response.status(500).json({
							status: 500,
							msg: "E-mail could not be changed!"
						});
					});
			} else {
				response.status(400).json({
					status: 400,
					data: params
				});
			}
		}
	},
	delete: {
		picture: async (req, response, next) => {
			const params = {
				username: req.username
			};
			userModel.delete
				.picture(params)
				.then(() => {
					fs.unlinkSync(`${paths.PUBLIC}/userPics/${params.filename}`);
					response.sendStatus(200);
				})
				.catch(err => next(err));
		},
		tag: async (req, response, next) => {
			const params = {
				username: req.username || "",
				tagName: req.tagName || ""
			};
			userModel.delete
				.tag(params)
				.then(() => response.sendStatus(200))
				.catch(err => next(err));
		}
	},
	stateOfLike : async (req, response) => {
		let user1 = req.username;
		let user2 = req.body.to;
		await userModel.stateOfLike(user1, user2)
		.then(res => {
			if (res === undefined)
			{
				response.status(200).json({
					status: 200,
					like: false
				});
			}
			else
			{
				response.status(200).json({
					status: 200,
					like: true
				});
			}

		})
	},
	like : async (req, response) =>  {
		let user1 = req.username;
		let user2 = req.body.to;
		await userModel.likeUser(user1, user2)
		.then( (res) => {
			let ResUser1 = res.user1;
			let ResUser2 = res.user2;
			if (ResUser1 === null)
			{
				if (ResUser2 !== null)
					 chatModel.addChat(user1,user2).catch(err => {});
				response.status(200).json({
					status: 200,
					like: true
				});	
			}
			else
			{
				userModel.disLikeUser(user1, user2)
					.then(res => {
						response.status(200).json({
							status: 200,
							like: false
						});
					})
				chatModel.deleteChat(user1,user2);
			}
		})
		.catch(err => {

		});
	}
};
