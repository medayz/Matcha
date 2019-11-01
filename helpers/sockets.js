module.exports = {
    removeUserSockets: async (user, sockets) => {
        const userSockets = sockets.filter(socket => socket.username != user);
        return userSockets;
    },
    getUserSocket: async (user, sockets) => {
        const userSocket = sockets.filter(socket => socket.username === user);
        return userSocket[0];
    }
};