const paths = require("../config/paths");
const query = require(paths.LIBRARIES + "/database");

module.exports = {
	getAllTags: async () => {
		return await query.getAllRows('MATCH (n:Tag) RETURN n;');
	},
	getTagByName: async (name) => {
		return await query.getOneRow('MATCH (n:Tag { name: $name }) RETURN n;', {
			name: name
		});
	},
	filterTags: async (name) => {
		return await query.getAllRows('MATCH (n:Tag) WHERE n.name =~ $name RETURN n;', {
			name: `^${name}.*`
		});
	},
	getTagsByUsername: async (username) => {
		return await query.getAllRows('MATCH p=(u:User {username: $username})-[r:INTERESTED_IN]->(t:Tag) RETURN t', {
			username: username
		});
	},
	countUserTags: async (username) => {
        return await query.rowCount(
            "MATCH p=(u:User {username: $username})-[r:INTERESTED_IN]->(t:Tag) RETURN t",
            { username: username }
        );
	}
};