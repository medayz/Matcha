const paths = require("../config/paths");
const query = require(paths.LIBRARIES + "/database");
const password = require(paths.HELPERS + "/hashing");

module.exports = {
	likeUser: async (user1, user2) => {
		return await query.getOneSpecialNodes(
			"MATCH (u1:User {username: $user1}), (u2:User {username: $user2}) OPTIONAL MATCH (u1)-[l1:LIKES]->(u2) OPTIONAL MATCH (u2)-[l2:LIKES]->(u1) MERGE (u1)-[:LIKES]->(u2) RETURN collect({user1: l1, user2: l2});",
			{
				user1: user1,
				user2: user2
			}
		);
	},
	disLikeUser: async (user1, user2) => {
		return await query.execute(
			"MATCH (u1:User {username: $user1}), (u2:User {username: $user2})  , (u1)-[l1:LIKES]->(u2) delete l1",
			{
				user1: user1,
				user2: user2
			}
		);
	},
	stateOfLike: async (user1, user2) => {
		return await query.getOneRow(
			"MATCH (u1:User {username: $user1}), (u2:User {username: $user2})  , (u1)-[l1:LIKES]->(u2) return l1",
			{
				user1: user1,
				user2: user2
			}
		);
	},
	getAllUsers: async () => {
		return await query.getAllRows("MATCH (n:User) RETURN n;");
	},
	getUser: async user => {
		return await query.getOneRow(
			"MATCH (n:User {username: $name }) return n;",
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
	getUsersWithCommonTags: async (params) => {
		return await query.getAllSpecialNodes(
			"MATCH (u1:User {username: $username})-[]->(t:Tag)<-[]-(u2:User) WITH count(DISTINCT t) AS c, u2.username AS user, round(distance(u1.location, u2.location)/1000) AS dist, duration.between(date(u2.birthDate), date()).years AS age WHERE dist <= $distance AND age >= $ageMin AND age <= $ageMax RETURN collect({ntags: c, username: user, distance: dist, age: age})",
			params
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
				"MATCH (u:User {username: $username}) SET u.location = point({longitude: $long, latitude: $lat}), u.country=$country, u.city=$city;",
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
