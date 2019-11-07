const paths = require("../config/paths");
const query = require(paths.LIBRARIES + "/database");

module.exports = {
	getAllNotifications: async (username) => {
		return await query.getAllRows('MATCH (:User {username: $name})-[:GOT_NOTIFIED]->(n) RETURN n;', {
			name: username
		})
	},
	readNotification: async (username) => {
		return await query.execute('MATCH (:User {username: $username})-[:GOT_NOTIFIED]->(n) set n.read = 1;',
		{
			username: username,
		}
		);
	}
}