const	notifsRouter =  require('express').Router();
const   query = require('../../libraries/database');

notifsRouter.get('/get/:username', (req, res) => {
	query.run('MATCH (:User {username: $name})-[:GET]->(n) RETURN n;', {name: req.params.username})
		.then((result) => {
			res.json(result);
		})
		.catch(err => console.log(err));
});

module.exports = notifsRouter;
