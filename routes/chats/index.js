const	chatRouter =  require('express').Router();
const   query = require('../../libraries/database');

chatRouter.get('/get/:username', (req, res) => {
	query.run('MATCH (n:User {username: $name})-[:PARTICIPATE_IN]->(c:Chat) RETURN c;', {name: req.params.username})
		.then(result => res.send(result))
		.catch(err => console.log(err));
});

module.exports = chatRouter;
