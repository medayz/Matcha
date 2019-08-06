const paths = require("../config/paths");
const query = require(`${paths.LIBRARIES}/database`);

module.exports = {
    getUserChats: async (username) => {
        return await query.getAllRows('MATCH (n:User {username: $name})-[:PARTICIPATE_IN]->(c:Chat) RETURN c;', {
            name: username
        });
    },
    addChat: (user1, user2) => {
        query.execute('MATCH (u1:User {username: $name1}), (u2:User {username: $name2}) CREATE (u1)-[:PARTICIPATE_IN]->(c:Chat {dateLastMsg: date(), timeLastMsg: time()})<-[:PARTICIPATE_IN]-(u2);', {
            name1: user1,
            name2: user2
        });
    },
    deleteChat: (user1, user2) => {
        query.execute('MATCH (u1:User {username: $name1})-[r1:PARTICIPATE_IN]->(c)<-[r2:PARTICIPATE_IN]-(u2:User {username: $name2}) DELETE r1, r2, c;', {
            name1: user1,
            name2: user2
        });
    },
    addMessage: (msg) => {
        query.execute('MATCH (u1:User {username: $name1})-[r1PARTICIPATE_IN]->(c)<-[r2:PARTICIPATE_IN]-(u2:User {username: $name2}) DELETE r1, r2, c;', {
            name1: user1,
            name2: user2
        });
    },
    deleteMessages: (user) => {
        query.execute('MATCH (c:Chat)-[r:CONTAINS]->(m) DELETE r, m;', {
            name1: user1,
            name2: user2
        });
    }
};