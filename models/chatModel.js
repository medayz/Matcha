const paths = require("../config/paths");
const query = require(`${paths.LIBRARIES}/database`);

module.exports = {
    getUserChats: async (username) => {
        return await query.getAllRows('MATCH (n:User {username: $name})-[:PARTICIPATE_IN]->(c:Chat) RETURN c;', {
            name: username
        });
    },
    addChat: (user1, user2) => {
        query.execute('MATCH (u1:User {username: $name1}), (u2:User {username: $name2}) CREATE (u1)-[:PARTICIPATE_IN]->(c:Chat {dateLastMsg: date(), timeLastMsg: time(), user1: $name1, user2: $name2})<-[:PARTICIPATE_IN]-(u2);', {
            name1: user1,
            name2: user2
        });
    },
    addMessage: (msg) => {
        query.execute('MATCH (u1:User {username: $name1})-[:PARTICIPATE_IN]->(c)<-[:PARTICIPATE_IN]-(u2:User {username: $name2}) CREATE (c)-[:CONTAINS]->(m:Message {date: date(), time: time(), sender: u1.username, body: $body})', {
            name1: msg.sender,
            name2: msg.receiver,
            body: msg.body
        });
    },
    deleteChat: (user1, user2) => {
        query.execute('MATCH (n:User {username: $name1})-[p1:PARTICIPATE_IN]->(c)<-[p2:PARTICIPATE_IN]-(u:User {username: $name2}) delete p1,p2,c;', {
            name1: user1,
            name2: user2
        });
    }
};