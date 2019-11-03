const paths = require("../config/paths");
const chatModel = require(`${paths.MODELS}/chatModel`);
const userModel = require(`${paths.MODELS}/userModel`);
const sockets = require(`${paths.HELPERS}/sockets`);

const eventHandlers = {
    msg: async (msg, calback) => {
        try {
            socketat.reverse();
            const userSocket = await sockets.getUserSocket(msg.to, socketat);
            socketat.reverse();
            const message = await chatModel.addMessage({
                sender: msg.from,
                receiver: msg.to,
                body: msg.msg,
                date: msg.date
            });
            const notif = await userModel.add.notification({
                username: msg.to,
                text: `${msg.from} sent you a message`
            });
            if (userSocket !== undefined) {
                userSocket.emit("msg", message);
                userSocket.emit("notification", notif);
            }
            calback(message);
        } catch (err) {
            console.log(err.message);
        }
    },
    login: async data => {
        try {
            socketat.reverse();
            const userSocket = await sockets.getUserSocket(data, socketat);
            socketat.reverse();
            if (userSocket !== undefined) socketa.emit("isOnline", true);
            else socketa.emit("isOnline", false);
        } catch (err) {
            console.log(err.message);
        }
    },
    logout: async function(data, socketat) {
        return await sockets.removeUserSockets(data, socketat);
    }
};

module.exports = function(socketa, socketat) {
    socketat.push(socketa);
    socketa.on("msg", data => eventHandlers.msg(data, socketat));
    socketa.on("isOnline", data => eventHandlers.login(data, socketat));
    socketa.on("ForceDisconnect", async data => {
        try {
            const filtered = await eventHandlers.logout();
            socketat.length = 0;
            socketat.push(...filtered);
        } catch (err) {
            console.log(err.message);
        }
    });
};
