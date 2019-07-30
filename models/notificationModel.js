const query = require('../libraries/database');

module.exports = {
    getAllNotifications: async (username) => {
        return await query.run('MATCH (:User {username: $name})-[:GET]->(n) RETURN n;', {
            name: username
        })
    }
}