module.exports = {
    removeUserSockets: async (user, sockets) => {
        const userSockets = sockets.filter(socket => socket.username != user);
        return userSockets;
    },
    getUserSocket: async (user, sockets) => {
        const userSocket = sockets.filter(socket => socket.username === user);
        return userSocket[0];
    },
    eventEmitter: async (user, sockets, event, payload) => {
        const userSocket = sockets.filter(socket => socket.username === user);
        userSocket.length && userSocket.forEach(socket => socket.emit(event, payload));
    }
};