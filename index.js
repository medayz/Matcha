const   express = require('express');

const   app = express();
const   PORT = process.env.PORT || 1337;

app.use('/api', require('./routes'));

app.get('/', (req, res) => {
	res.send("Hello World from 1337!");
});

app.listen(PORT, () => console.log(`running on port ${PORT}...`));
