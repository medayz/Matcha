const paths = require("../config/paths");
const query = require(paths.LIBRARIES + "/database");

module.exports = {
    getUserPics: async (params) => {
        console.log('params', params);
        return await query
            .getAllSpecialNodes(
                "MATCH (:User {username: $username})-[:UPLOADED]->(p:Picture) return collect({filename: p.name,ispp: p.profilePicture});",
                params
            );
    },
	countUserPics: async (username) => {
        return await query.rowCount(
            "MATCH (u:User {username: $username})-[:UPLOADED]->(p:Picture { isProfilePic: false }) RETURN p;",
            { username: username }
        );
	}
}