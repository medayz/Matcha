const paths = require("../config/paths");
const query = require(`${paths.LIBRARIES}/database`);

module.exports = {
    getUserChats: async (username) => {
        return await query.getAllSpecialNodes('MATCH (:User {username: $name})-[]->(c:Chat)<-[]-(u:User) RETURN collect({date: c.dateLastMsg, time: c.timeLastMsg, name: u.username})', {
            name: username
        });
    },
    getMessages: async (sender, receiver) => {
        return await query.getAllRows('MATCH (:User {username: $sender})-[]->(c:Chat)<-[]-(:User {username: $receiver}) MATCH (c)-[:CONTAINS]->(m) RETURN m;', {
            sender: sender,
            receiver: receiver
        });
    },
    addChat: async (user1, user2) => {
        await query.execute('MATCH (u1:User {username: $name1}), (u2:User {username: $name2}) CREATE (u1)-[:PARTICIPATE_IN]->(c:Chat {dateLastMsg: date(), timeLastMsg: time(), user1: $name1, user2: $name2})<-[:PARTICIPATE_IN]-(u2);', {
            name1: user1,
            name2: user2
        });
    },
    addMessage: (msg) => {
        query.execute('MATCH (u1:User {username: $name1})-[:PARTICIPATE_IN]->(c)<-[:PARTICIPATE_IN]-(u2:User {username: $name2}) CREATE (c)-[:CONTAINS]->(m:Message {date: date(), time: time(), sender: u1.username, receiver: u2.username,body: $body})', {
            name1: msg.sender,
            name2: msg.receiver,
            body: msg.body
        });
    },
    deleteChat: (user1, user2) => {
        query.execute('MATCH (:User {username: $name1})-[:PARTICIPATE_IN]->(c)<-[:PARTICIPATE_IN]-(:User {username: $name2}) DETACH DELETE c;', {
            name1: user1,
            name2: user2
        });
    }
};