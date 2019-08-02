const paths = require("../config/paths");
const query = require(paths.LIBRARIES + "/database");

module.exports = {
    getUserPics: async (params) => {
        return await query
            .getAllRows('MATCH (a:User {username: $username})-[:UPLOADED]->(p:Picture) return p', pics);
    }
}