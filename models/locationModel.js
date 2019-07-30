const query = require('../libraries/database');

module.exports = {
    getUserlocations: async (username) => {
        return await query.run('MATCH (:User {username: $name})-[:LOGGED_ON]->(n) RETURN n;', {
            name: username
        })
    }
}