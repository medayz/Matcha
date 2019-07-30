const query = require('../libraries/database');

module.exports = {
    getUserPics: async (params) => {
        return await query
            .run('MATCH (a:User {username: $username})-[:UPLOADED]->(p:Picture) return p', pics);
    }
}