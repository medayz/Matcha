const express = require("express");
const app = express();
const PORT = process.env.PORT || 1337;
const cors = require("cors");
const session = require("express-session");
const genuuid = require("uuid");
const FileStore = require("session-file-store")(session);
const multer = require("multer");

app.disable("x-powered-by");
app.use(cors());

app.use(express.static('public'));

app.use(
	session({
		genid: function(req) {
				return genuuid();
		},
		resave: false,
		saveUninitialized: false,
		secret: "testets",
		cookie: {
				secure: false,
				httpOnly: true,
				maxAge: 600000000
		},
		store: new FileStore(),
		name: "session"
	})
);

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
		console.log('laa');
	}
	response.status(status).json({
		status: status,
		msg: err.message
	});
});

var http = require('http').createServer(app);
var io = require('socket.io')(http);

var allUserSocket = [];

function getHisSocket (user, all)
{
	var promise = new Promise (function (resolve, reject) {
		var socket = all.filter(a => a.user === user);
		resolve (socket[0]);
	})
	return promise;
}

io.on('connection', (socketa) =>{
	console.log('a user is connected')
	var  usersocket = {
		idSocket : socketa.conn.id,
		user : socketa.handshake.query['owner'],
		socket :  socketa
	}
	allUserSocket.push(usersocket);
	var mysocket = socketa;
	mysocket.on('msg', async function (data) {
		var msg = data;
		var hisSocket = [];
		await getHisSocket(msg.to, allUserSocket).then(res => {
			hisSocket = res;
		});
		hisSocket.socket.emit('msg', msg);
		mysocket.emit('msg', msg);
	});
})

http.listen(PORT, () => console.log(`running on port ${PORT}...`));
