const paths = require("../config/paths");
const   chatModel = require(`${paths.MODELS}/chatModel`);
const   userModel = require(`${paths.MODELS}/userModel`);
var     allUserSocket = [];

function removeHisSocket(user, sockets)
{
	const promise = new Promise(function (resolve, reject){
		const userSockets = sockets.filter(socket => socket.username != user);
		resolve(userSockets);
	})
	return (promise);
}

function getHisSocket (user, sockets)
{
	const promise = new Promise (function (resolve, reject) {
		const userSocket = sockets.filter(socket => socket.username === user);
		resolve (userSocket[0]);
	})
	return promise;
}

module.exports = function (socketa, socketat) {
	// if( typeof this.socketArray == 'undefined' ) {
    //     this.socketArray = [];
	// }
	// this.socketArray.push(socketa);
	socketat.push(socketa);
	socketa.on('msg', async (data, calback) => {
		var msg = data;
		// this.socketArray.reverse();
		socketat.reverse();
		// getHisSocket(msg.to, this.socketArray)
		getHisSocket(msg.to, socketat)
			.then(hisSocket => {
				// this.socketArray.reverse();
				socketat.reverse();
				const message = {
					sender: msg.from,
					receiver: msg.to,
					body: msg.msg, 
					date: msg.date
				};
				const notif = {
					username: msg.to,
					text: `${msg.from} sent you a message`
				};
				if (hisSocket !== undefined) {
					hisSocket.emit('msg', message);
					hisSocket.emit('notification', notif);
				}
				chatModel.addMessage(message);
                userModel.add.notification(notif);
				calback(message);
			});
	});

	socketa.on('isOnline', async (data) => {
		// this.socketArray.reverse();
		socketat.reverse();
		// await getHisSocket(data, this.socketArray).then(res => {
		await getHisSocket(data, socketat).then(res => {
			// this.socketArray.reverse();
			socketat.reverse();
			hisSocket = res;
			if (hisSocket !== undefined)
				socketa.emit('isOnline', true);
			else
				socketa.emit('isOnline', false);
		});
	});

	socketa.on('ForceDisconnect', async function (data) {
		// removeHisSocket(data, this.socketArray)
		removeHisSocket(data, socketat)
			// .then(res => this.socketArray = res)
			.then(res => socketat = res)
			.catch(err => {});
	});

	socketa.on('like', data => {

	});
};