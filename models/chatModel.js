const paths = require("../config/paths");
const query = require(paths.LIBRARIES + "/database");

module.exports = {
    getUserChats: async (username) => {
        return await query.getAllRows('MATCH (n:User {username: $name})-[:PARTICIPATE_IN]->(c:Chat) RETURN c;', {
            name: username
        })
    }
};