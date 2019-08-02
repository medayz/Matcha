const paths = require("../config/paths");
const query = require(paths.LIBRARIES + "/database");

module.exports = {
    getUserlocations: async (username) => {
        return await query.getAllRows('MATCH (:User {username: $name})-[:LOGGED_ON]->(n) RETURN n;', {
            name: username
        })
    }
}