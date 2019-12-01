const express = require("express");
const app = express();
const PORT = process.env.PORT || 1337;
const cors = require("cors");
const cookie = require('cookie');
const cookieParser = require('cookie-parser');
const multer = require("multer");
const paths = require("./config/paths");
const jwtHelper = require(`${paths.HELPERS}/jwtokens`);
const sockets = require(`${paths.LIBRARIES}/sockets`);
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const socketat = [];

app.disable("x-powered-by");
app.use(cors());
app.use(cookieParser());

app.use(express.static('public'));

app.use("/api", (req, res, next) => {
	req.sockets = socketat;
	next();
}, require("./routes"));

app.get("/home", (req, res) => res.send("Hello World from 1337!"));

app.use((req, response, next) => {
	const error = new Error();
	error.message = "Resource Not Found";
	error.status = 404;
	next(error);
});

app.use((err, req, response, next) => {
	const status = err.status || 500;
	if (err instanceof multer.MulterError) {
		console.log('upload error!');
	}	else {
		console.log(err.message);
	}
	response.status(status).json({
		status: status,
		msg: err.message
	});
});

io.use(async function (socket, next) {
	try {
		const cookies = cookie.parse(socket.request.headers.cookie);
		const payload = await jwtHelper.checkToken(cookies.token);
		socket.username = payload.username;
		console.log(socketat.length);
		next();
	} catch (err) {
		console.log(err.message);
		next(err);
	}
});

io.on('connection', (socketa) => sockets(socketa, socketat));

http.listen(PORT, {pingTimeout: 600000},() => console.log(`running on port ${PORT}...`));
