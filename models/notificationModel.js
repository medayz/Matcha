const paths = require("../config/paths");
const query = require(paths.LIBRARIES + "/database");

module.exports = {
    getAllNotifications: async (username) => {
        return await query.getAllRows('MATCH (:User {username: $name})-[:GET]->(n) RETURN n;', {
            name: username
        })
    }
}