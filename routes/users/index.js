const 	usersRouter =  require('express').Router();
const	query = require('../../libraries/database');

usersRouter.get('/get', (req, res) => {
	query.run('MATCH (n:User) RETURN n;')
		.then((results) => {
			res.json(results);
		});
});

module.exports = usersRouter;
