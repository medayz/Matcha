const paths = require("../config/paths");
const chatModel = require(`${paths.MODELS}/chatModel`);
const userModel = require(`${paths.MODELS}/userModel`);
const sockets = require(`${paths.HELPERS}/sockets`);

const eventHandlers = {
  msg: async (msg, callback, socketat) => {
    try {
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
      sockets.eventEmitter(msg.to, socketat, "msg", message.props);
      sockets.eventEmitter(msg.to, socketat, "notification", notif.props);
      callback(message.props);
    } catch (err) {
      console.log(err.message);
    }
  },
  login: async (user, socketa, socketat) => {
    try {
      const userSocket = await sockets.getUserSocket(user, socketat);
      userSocket !== undefined
        ? socketa.emit("isOnline", true)
        : socketa.emit("isOnline", false);
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
  socketa.on("msg", (data, callback) =>
    eventHandlers.msg(data, callback, socketat)
  );
  socketa.on("isOnline", user => eventHandlers.login(user, socketa, socketat));
  socketa.on("ForceDisconnect", async data => {
    try {
      const filtered = await eventHandlers.logout(data, socketat);
      socketat.length = 0;
      socketat.push(...filtered);
    } catch (err) {
      console.log(err.message);
    }
  });
};
