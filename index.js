const express = require("express");
const app = express();
const PORT = process.env.PORT || 1337;
const cors = require("cors");
const cookie = require('cookie');
const cookieParser = require('cookie-parser');
// const session = require("express-session");
// const genuuid = require("uuid");
// const FileStore = require("session-file-store")(session);
const multer = require("multer");
const paths = require("./config/paths");
const jwtHelper = require(`${paths.HELPERS}/jwtokens`);
const chatsModel = require(`${paths.MODELS}/chatModel`);
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.disable("x-powered-by");
app.use(cors());
app.use(cookieParser());

app.use(express.static('public'));

// app.use(
// 	session({
// 		genid: function(req) {
// 				return genuuid();
// 		},
// 		resave: false,
// 		saveUninitialized: false,
// 		secret: "testets",
// 		cookie: {
// 				secure: false,
// 				httpOnly: true,
// 				maxAge: 600000000
// 		},
// 		store: new FileStore(),
// 		name: "session"
// 	})
// );

app.use("/api", require("./routes"));

app.get("/", (req, res) => res.send("Hello World from 1337!"));

app.use((req, response, next) => {
	const error = new Error();
	error.message = "Resource Not Found";
	error.status = 404;
	next(error);
});

app.use((err, req, response, next) => {
	console.log('error handler');
	const status = err.status || 500;
	if (err instanceof multer.MulterError) {
		console.log('multeeeeeeeer');
	}	else {
		console.log(err.message);
	}
	response.status(status).json({
		status: status,
		msg: err.message
	});
});


var allUserSocket = [];

function getHisSocket (user, all)
{
	//console.log(all[0].idSocket);
	all.reverse();
	var promise = new Promise (function (resolve, reject) {
		var socket = all.filter(a => a.user === user);
		resolve (socket[0]);
	})
	all.reverse();
	return promise;
}

io.use(async (socket, next) => {
	try {
		const cookies = cookie.parse(socket.request.headers.cookie);
		console.log(socket.handshake.address);
		const payload = await jwtHelper.checkToken(cookies.token);
		socket.username = payload.username;
		next();
	} catch (err) {
		console.log(err.message);
		next(err);
	}
});

io.on('connection', (socketa) =>{
	console.log('a user is connected')
	var  usersocket = {
		idSocket : socketa.conn.id,
		user : socketa.handshake.query['owner'],
		socket :  socketa
	}
	//console.log(usersocket);
	allUserSocket.push(usersocket);
	var mysocket = socketa;
	mysocket.on('msg', async function (data) {
		var msg = data;
		console.log(msg);
		var hisSocket = [];
		await getHisSocket(msg.to, allUserSocket).then(res => {
			hisSocket = res;
			let message = {
				sender: msg.from,
				receiver: msg.to,
				body: msg.msg, 
				date: msg.date
			}
			if (hisSocket !== undefined)
				hisSocket.socket.emit('msg', message);
			chatsModel.addMessage(message);
			mysocket.emit('msg', message);
			
		});
		
	});
})

http.listen(PORT, () => console.log(`running on port ${PORT}...`));
