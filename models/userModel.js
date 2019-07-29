const   fetch = require('node-fetch');
const   query = require('../libraries/database');
const   password = require('../helpers/hashing');

module.exports = {
	getAllUsers: async () => {
		return await query.run('MATCH (n:User) RETURN n;');
	},
	getUser: async (user) => {
		return await query.run('MATCH (n:User {username: $name}) RETURN n;', {name: user});
	},
	getUserByEmail: async (email) => {
		return await query.run('MATCH (n:User {email: $email}) RETURN n;', {email: email});
	},
	addUser: async (newUser) => {
		newUser.pass = await password.hash(newUser.pass);
		query.run('CREATE (u:User {emailToken: $emailToken, lName: $lName, activated: $active, fName: $fName, email: $email, username: $username, pwd: $pwd})',
				{
					fName: newUser.fName,
					lName: newUser.lName,
					username: newUser.username,
					email: newUser.email,
					pwd: newUser.pass,
					emailToken: newUser.emailToken,
					active: false
				}
		);
	},
	logUser: async (params) => {
		if (!params.username)
			throw new Error("Username not registered!");
		let user = await fetch(`http://localhost:1337/api/users/get/${params.username}`);
		user = await user.json();
		if (user.length) {
			user = user[0].props;
			if (await password.verify(params.pass, user.pwd)) {
				return true;
			}	else {
				throw new Error("Wrong password!");
			}
		}	else {
			throw new Error("Username not registered!");
		}
	}
};
