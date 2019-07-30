const query = require('../libraries/database');

module.exports = {
    getUserChats: async (username) => {
        return await query.run('MATCH (n:User {username: $name})-[:PARTICIPATE_IN]->(c:Chat) RETURN c;', {
            name: username
        })
    }
};