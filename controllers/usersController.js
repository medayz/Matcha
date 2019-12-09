const paths = require("../config/paths");
const jwtHelper = require(`${paths.HELPERS}/jwtokens`);
const userModel = require(`${paths.MODELS}/userModel`);
const chatModel = require(`${paths.MODELS}/chatModel`);
const pictureModel = require(`${paths.MODELS}/pictureModel`);
const validator = require(`${paths.HELPERS}/validator`);
const mail = require(`${paths.HELPERS}/sendmail`);
const token = require(`${paths.HELPERS}/token`);
const sockets = require(`${paths.HELPERS}/sockets`);
const fs = require('fs');
const NodeGeocoder = require("node-geocoder");

const options = {
  provider: "google",

  // Optional depending on the providers
  httpAdapter: "https", // Default
  apiKey: "AIzaSyBc39oUNubkrmDpYhBqBtxjmTDhYcllEec", // for Mapquest, OpenCage, Google Premier
  formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);

module.exports = {
	whoami: async (req, response) => {
		response.json({
			status: 200,
			user: req.username
		});
	},
	completed: async (req, response) => {
		response.sendStatus(200);
	},
	isAmatch: async (req, response) => {
		chatModel
			.chatExists(req.username, req.params.visited)
			.then(res => {
				if (res.exists) {
					response.json({
						status: 200,
						msg: "You're connected to this user!"
					});
				} else {
					response.json({
						status: 200,
						msg: ""
					});
				}
			})
			.catch(err => {
				console.log("it's not a match");
			});
	},
	isBlocked: async (req, response) => {
		userModel
			.isBlocked(req.username, req.params.visited)
			.then(res => {
				if (!res) {
					response.json({
						status: 200,
						msg: "Not Blocked!"
					});
				} else {
					response.status(403).json({
						status: 403,
						msg: "Blocked"
					});
				}
			})
			.catch(err => {
				console.log("not blocked!");
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
					city,
					activated,
					bio,
					gender,
					sexualPref,
					birthDate,
					place
				} = results.props;
				results = {
					username: username,
					fName: fName,
					lName: lName,
					email: email,
					country: country,
					city: city,
					activated: activated,
					bio: bio,
					gender: gender,
					sexualPref: sexualPref,
					birthDate: birthDate,
					place: place
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
	getUserByUsername: async (req, response) => {
		userModel
			.getUser(req.params.username)
			.then(async results => {
				const isBlocked = await userModel.isBlocked(req.username, req.params.username);
				if (results && !isBlocked) {
					const isAmatch = await chatModel.chatExists(req.username, req.params.username);
					let {
						lName,
						fName,
						username,
						country,
						place,
						sexualPref,
						gender,
						birthDate,
						bio,
						fameRating,
						timeLastCnx,
						dateLastCnx
					} = results.props || {};
					results = {
						username: username,
						fName: fName,
						lName: lName,
						country: country,
						place: place,
						sexualPref: sexualPref,
						gender: gender,
						birthDate: birthDate,
						bio: bio,
						fameRating: fameRating,
						timeLastCnx: timeLastCnx,
						dateLastCnx: dateLastCnx,
						match: isAmatch ? "You're connected to this user!" : ""
					};
					response.json({
						status: 200,
						data: results
					});
				} else if (isBlocked) {
					response.status(403).json({
						status: 403,
						msg: "Blocked"
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
			email: req.body.email || "",
			birthDate: req.body.birthDate || "",
			pass: req.body.pass || "",
			cPass: req.body.cPass || "",
		};
		params.err = {
			fName: validator.firstName(params.fName),
			lName: validator.lastName(params.lName),
			username: validator.username(
				params.username,
				await userModel.getUser(params.username)
			),
			email: validator.email(
				params.email,
				await userModel.getUserByEmail(params.email)
			),
			birthDate: validator.birthDate(params.birthDate),
			pass: validator.password(params.pass),
			cPass: validator.confirmPassword(params.pass, params.cPass)
		};
		if (!Object.values(params.err).filter(obj => obj !== "").length) {
			let newUser = Object.assign({}, params);
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
						// req.session.token = token;
						response
							.cookie("token", token, { httpOnly: true })
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
		await userModel.edit.lastTimeCnx(req.username);
		response.clearCookie("token").sendStatus(200);
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
	getResetPassToken: async (req, response) => {
		const tok = token.get();
		const user = req.body.username;
		console.log(user);
		userModel
			.getUser(user)
			.then(async result => {
				result = result.props;
				await userModel.addPwdToken(result.username, tok);
				mail.send({
					receiver: result.email,
					subject: "Reset Password link!",
					body: "message body goes here!",
					html: `<h1>You can reset your password from <a href="http:/localhost:3000/resetpwd/${user}/${tok}">here</a></h1>`
				})
				.then(res => {
					response.json({
						status: 200,
						msg: "An Email has been sent for you with a reset link!"
					});
				})
				.catch(err => {
					console.log(err.message);
					response.status(500).json({
						status: 500,
						msg: "Unsuccesful operation, please retry!"
					});
				});
			})
			.catch(err => console.log(err.message));
	},
	resetPassword: async (req, response) => {
		const params = {
			username: req.body.username || "",
			pass: req.body.pass || "",
			cPass: req.body.cPass || ""
		};
		params.err = {
			username: validator.username(params.username),
			pass: validator.password(params.pass),
			cPass: validator.confirmPassword(params.pass, params.cPass)
		};
		if (!Object.values(params.err).filter(obj => obj !== "").length) {
			userModel
				.getUser(req.params.username)
				.then(async result => {
					if (result) {
						result = result.props;
						if (result.resetPwdToken === req.params.token) {
							const resetPwd = userModel.edit.password(
								params.username,
								params.pass
							);
							const rmToken = userModel.removePwdToken(
								req.params.username
							);
							await Promise.all([resetPwd, rmToken]);
							response.json({
								status: 200,
								msg: "Your Password has been successfully changed!"
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
			} else {
				response.status(400).json({
					status: 400,
					data: params
				});
			}
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
				if (npics === 5) {
					const err = new Error("You can't upload more than 5 pictures");
					err.status = 400;
				}
				if (npics === 0)
					params.isProfilePic = 'true';
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
		location: async (req, response) => {
			const params = {
				username: req.username,
				long: req.body.long || null,
				lat: req.body.lat || null,
				place: req.body.place || "",
				err: {}
			};
			let location = [];
			if (params.place) {
				location = await geocoder.geocode(params.place)
				params.err = {
					place: validator.place(location, params.long, params.lat)
				};
			} else if (!params.long || !params.lat) {
				return response.sendStatus(200);
			}
			if (!Object.values(params.err).filter(obj => obj !== "").length) {
				if (params.place) {
					params.long = location[0].longitude;
					params.lat = location[0].latitude;
				} else if (params.long && params.lat) {
					const place = await geocoder.reverse({ lat: params.lat, lon: params.long });
					params.place = place[0].formattedAddress;
				}
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
			} else {
				response.status(400).json({
					status: 400,
					data: params
				});
			}
		},
		view: async (req, response) => {
			const params = {
				user1: req.username,
				user2: req.body.viewed
			};
			(params.user1 !== params.user2)
			&& userModel.add.view(params)
				.then(async res => {
					userModel.fameRate(params.user2);
					const user2Notif = await userModel.add.notification({
						username: params.user2,
						text: `${params.user1} viewed your profile`
					});
					sockets.eventEmitter(params.user2, req.sockets, 'notification', user2Notif.props);
					response.sendStatus(200);
				});
		},
		block: async (req, response) => {
			const params = {
				user1: req.username,
				user2: req.body.blocked
			};
			(params.user1 !== params.user2)
			&& userModel.add.block(params)
				.then(res => {
					userModel.disLikeUser(params.user1, params.user2);
					chatModel.deleteChat(params.user1, params.user2);
					response.json({
						status: 200,
						msg: "User blocked successfully!"
					});
				}).catch(err => {
					response.status(500).json({
						status: 500,
						msg: "Something went wrong!"
					});
				});
		},
		report: async (req, response) => {
			const params = {
				user1: req.username,
				user2: req.body.reported
			};
			(params.user1 !== params.user2)
			&& userModel.add.report(params)
				.then(res => {
					userModel.fameRate(params.user2);
					response.json({
						status: 200,
						msg: "User reported successfully!"
					});
				}).catch(err => {
					response.status(500).json({
						status: 500,
						msg: "Something went wrong!"
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
			tags: req.body.tags || 0,
			fameRating: req.body.fame || 0
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
	search: async (req, response, next) => {
		const	params = {
			username: req.username,
			location: req.body.location || "",
			ageMin: req.body.ageMin || 18,
			ageMax: req.body.ageMax || 25,
			tags: req.body.tags || [],
			fameMin: req.body.fameMin || 0,
			fameMax: req.body.fameMax || 0
		};
		const place = params.location ? await geocoder.geocode(params.location) : [0];
		console.log(place);
		params.lon = place[0] ? (place[0].longitude || 0) : 0;
		params.lat = place[0] ? (place[0].latitude || 0) : 0;
		params.location && delete params.location;
		console.log(params);
		userModel
			.searchUsers(params)
			.then(res => {
				response.json({
					status: 200,
					data: res
				});
			}).catch(err => {console.log(err); next("Something Went Wrong!");});
	},
	edit: {
		infos: async (req, response) => {
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
				lName: validator.lastName(params.lName),
				gender: validator.gender(params.gender),
				sexualPref: validator.sexualPref(params.sexualPref),
				birthDate: validator.birthDate(params.birthDate),
				bio: validator.bio(params.bio)
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
							response.clearCookie("token").json({
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
		},
		picture: async (req, response) => {
			const params = {
				filename: req.body.filename
			};
			try {
				await userModel.edit.removeProfilePicture(req.username);
				await userModel.edit.setProfilePicture(params.filename);
				response.status(200).json({
					status: 200,
					msg: "Image was setted as profile picture"
				});
			} catch (error) {
				console.log(error);
			}
			
		}
	},
	delete: {
		picture: async (req, response, next) => {
			const params = {
				username: req.username || "",
				filename: req.body.filename || ""
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
				tagName: req.body.tagName || ""
			};
			console.log(params);
			userModel.delete
				.tag(params)
				.then(() => response.sendStatus(200))
				.catch(err => next(err));
		}
	},
	stateOfLike : async (req, response) => {
		let user1 = req.username;
		let user2 = req.body.to;
		userModel.stateOfLike(user1, user2)
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
			});
	},
	like : async (req, response) =>  {
		const user1 = req.username;
		const user2 = req.body.to;

		(user1 !== user2)
		&& userModel.likeUser(user1, user2)
			.then( async (res) => {
				let ResUser1 = res.user1;
				let ResUser2 = res.user2;

				userModel.fameRate(user2);
				if (ResUser1 === null)
				{
					const user2Notif = await userModel.add.notification({
						username: user2,
						text: `${user1} liked you`
					});
					sockets.eventEmitter(user2, req.sockets, 'notification', user2Notif.props);
					if (ResUser2 !== null) {
						const user1Notif = await userModel.add.notification({
							username: user1,
							text: `you're now connected with ${user2}`
						});
						const user2Notif = await userModel.add.notification({
							username: user2,
							text: `you're now connected with ${user1}`
						});
						sockets.eventEmitter(user1, req.sockets, 'notification', user1Notif.props);
						sockets.eventEmitter(user2, req.sockets, 'notification', user2Notif.props);
						chatModel.addChat(user1, user2);
					}
					response.status(200).json({
						status: 200,
						like: true
					});	
				}
				else
				{
					const user2Notif = await userModel.add.notification({
						username: user2,
						text: `${user1} unliked you`
					});
					sockets.eventEmitter(user2, req.sockets, 'notification', user2Notif.props);
					userModel.disLikeUser(user1, user2);
					chatModel.deleteChat(user1, user2);
					response.status(200).json({
						status: 200,
						like: false
					});
				}
			})
			.catch(err => {
				console.log(err.message);
			});
	}
};
