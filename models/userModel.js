const paths = require("../config/paths");
const query = require(paths.LIBRARIES + "/database");
const password = require(paths.HELPERS + "/hashing");

module.exports = {
	getAllUsers: async () => {
		return await query.getAllRows("MATCH (n:User) RETURN n;");
	},
	getUser: async user => {
		return await query.getOneRow(
			"MATCH (n:User {username: $name}) RETURN n;",
			{
				name: user
			}
		);
	},
	getUserByEmail: async email => {
		return await query.getOneRow(
			"MATCH (n:User {email: $email}) RETURN n;",
			{
				email: email
			}
		);
	},
	addUser: async newUser => {
		newUser.pass = await password.hash(newUser.pass);
		await query.execute(
			"CREATE (u:User {emailToken: $emailToken, lName: $lName, activated: $active, fName: $fName, email: $email, username: $username, pwd: $pwd})",
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
	checkUserPwd: async params => {
		let user = await query.getOneRow(
			"MATCH (n:User {username: $name}) RETURN n;",
			{
				name: params.username
			}
		);
		user = {
			pwd: user.props.pwd,
			activated: user.props.activated
		};
		if (await password.verify(params.pass, user.pwd)) {
			if (!user.activated) throw new Error(-1);
			return true;
		} else {
			throw new Error(-2);
		}
	},
	removeEmailToken: async username => {
		await query.execute(
			"MATCH (u:User {username: $user}) REMOVE u.emailToken;",
			{
				user: username
			}
		);
	},
	setUserActive: async username => {
		await query.execute(
			"MATCH (u:User {username: $user}) SET u.activated = true;",
			{
				user: username
			}
		);
	},
	add: {
		picture: async params => {
			await query.execute(
				"MATCH (u:User {username: $username}) CREATE (u)-[:UPLOADED]->(p:Picture {name: $filename, date: date(), isProfilePicture: $isProfilePic})",
				params
			);
		},
		tag: async params => {
			await query.execute(
				"MATCH (u:User {username: $username}) MERGE (t:Tag {name: $name}) MERGE (u)-[:INTERESTED_IN]->(t);",
				params
			);
		},
		location: async params => {
			await query.execute(
				"MATCH (u:User {username: $username}) SET u.longitude=$long, u.latitude=$lat, u.country=$country, u.city=$city;",
				{
					username: params.username || "",
					long: params.long || null,
					lat: params.lat || null,
					country: params.country || "",
					city: params.city || ""
				}
			);
		}
	},
	edit: {
		infos: async (username, newInfos) => {
			await query.execute(
				"MATCH (u:User {username: $username}) SET u.lName = $lName, u.fName = $fName, u.gender = $gender, u.sexualPref = $sexualPref, u.bio = $bio, u.birthDate = $birthDate;",
				{
					username: username,
					fName: newInfos.fName,
					lName: newInfos.lName,
					gender: newInfos.gender,
					sexualPref: newInfos.sexualPref,
					bio: newInfos.bio,
					birthDate: newInfos.birthDate
				}
			);
		},
		username: async (username, newUsername) => {
			await query.execute(
				"MATCH (u:User {username: $username}) SET u.username = $newUsername;",
				{
					username: username,
					newUsername: newUsername
				}
			);
		},
		password: async (username, pwd) => {
			pwd = await password.hash(pwd);
			await query.execute(
				"MATCH (u:User {username: $username}) SET u.pwd = $password;",
				{
					username: username,
					password: pwd
				}
			);
		},
		email: async (username, newEmail) => {
			await query.execute(
				"MATCH (u:User {username: $username}) SET u.email = $newEmail;",
				{
					username: username,
					newEmail: newEmail
				}
			);
		}
	},
	delete: {
		picture: async (params) => {
			await query.execute(
				"MATCH (u:User {username: $username})-[r:UPLOADED]->(p) WHERE p.name=$filename DELETE r, p",
				params
			);
		},
		tag: async (params) => {
			await query.execute(
				"MATCH (u:User {username: $username})-[r:INTERESTED_IN]->(p:Tag {name: $tagName}) DELETE r;",
				params
			);
		}
	}
};
