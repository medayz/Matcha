const express = require("express");
const path = require("path");
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
var io = require('socket.io')(http, {pingTimeout: 60000});
const socketat = [];

app.disable("x-powered-by");
app.use(cors());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'client/build')));

app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'client/build')));

app.use("/api", (req, res, next) => {
	req.sockets = socketat;
	next();
}, require("./routes"));


app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

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
		next();
	} catch (err) {
		console.log(err.message);
		next(err);
	}
});


io.on('connection', (socketa) => sockets(socketa, socketat));

http.listen(PORT, () => console.log(`running on port ${PORT}...`));
