const paths = require("../config/paths");
const jwtHelper = require(`${paths.HELPERS}/jwtokens`);
const userModel = require(`${paths.MODELS}/userModel`);
const validator = require(`${paths.HELPERS}/validator`);
const mail = require(`${paths.HELPERS}/sendmail`);
const token = require(`${paths.HELPERS}/token`);
const upload = require(`${paths.HELPERS}/upload`);

module.exports = {
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
  getUserByUsername: (req, response) => {
    userModel
      .getUser(req.params.username)
      .then(results => {
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
      fName: req.body.fName ? req.body.fName.trim() : "",
      lName: req.body.lName ? req.body.lName.trim() : "",
      username: req.body.username ? req.body.username.trim() : "",
      email: req.body.email ? req.body.email.trim() : "",
      pass: req.body.pass ? req.body.pass : "",
      cPass: req.body.cPass ? req.body.cPass : ""
    };
    params.err = {
      fName: validator.firstName(params.fName),
      lName: validator.lastName(params.lName),
      username: validator.username(params.username),
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
      mail
        .send({
          receiver: params.email,
          subject: "Confirm your e-mail address",
          body: "message body goes here!",
          html: "<h1>test html</h1><br>here's your token: " + tok
        })
        .catch(err => console.log(err));
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
            response.json({
              status: 200,
              data: {
                token: token
              }
            });
          })
          .catch(err => {
            if (err.message != -1 && err.message != -2) {
              response.status(500).json({
                status: 500,
                msg: errors[2]
              });
            } else {
              params.err.active = err.message == -1 ? errors[1] : "";
              params.err.pass = err.message == -2 ? errors[0] : "";
              response.status(400).json({
                status: 400,
                data: params
              });
            }
            console.log(`error msg: ${err.message}`);
          });
      } else {
        params.err.username = "Username not registered";
        response.json({
          status: 400,
          data: params
        });
      }
    } else {
      params.err.username = "Username not registered";
      response.json({
        status: 400,
        data: params
      });
    }
  },
  accountActivation: async (req, response) => {
    userModel
      .getUser(req.params.username)
      .then(async result => {
        if (result) {
          result = result.props;
          if (result.emailToken === req.params.token) {
            const setActive = userModel.setUserActive(req.params.username);
            const rmToken = userModel.removeEmailToken(req.params.username);
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
    picture: (req, res) => {
			upload(req, res, (err) => {
      			if (!err){
					if (!req.file){
						res
						.status(400)
						.json({
							status: 400,
							msg: 'Image not found'
						});
					}
					else {
						res
						.status(200)
						.json({
							status: 200,
							msg: 'Image modified !'
						});
					}
				}
				else{
					if (!req.file)
					res
						.status(400)
						.json({
							status: 400,
							msg: err
						});
				}
			 });
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
    }
  },
  edit: {
    infos: (req, response) => {
      const params = {
        fName: req.body.fName ? req.body.fName.trim() : "",
        lName: req.body.lName ? req.body.lName.trim() : "",
        gender: req.body.gender ? req.body.gender.trim() : "",
        sexualPref: req.body.sexualPref ? req.body.sexualPref.trim() : "",
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
        newUsername: req.body.newUsername ? req.body.newUsername.trim() : ""
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
        cPass: req.body.cPass ? req.body.cPass : "",
      };
      params.err = {
        pass: "",
        newPass: validator.password(params.newPass),
        cPass: validator.confirmPassword(params.newPass, params.cPass)
      }
      userModel
        .checkUserPwd(params)
        .then(async result => {
          try {
            if (!Object.values(params.err).filter(errMsg => errMsg).length) {
              await userModel.edit.password(params.username, params.newPass);
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
  }
};
