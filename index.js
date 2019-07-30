const express = require('express');
const app = express();
const PORT = process.env.PORT || 1337;
const cors = require('cors');

app.use(cors());

app.use('/api', require('./routes'));

app.get('/', (req, res) => {
	res.send("Hello World from 1337!");
});

app.use((req, response, next) => {
	response
		.status(404)
		.json({
			status: 404,
			message: "Resources not found!"
		});
});

app.use((req, res, next) => {
	response
		.status(500)
		.json({
			status: 500,
			message: "Resources not found!"
		});
});

app.listen(PORT, () => console.log(`running on port ${PORT}...`));