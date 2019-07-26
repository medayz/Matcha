const	tagsRouter =  require('express').Router();
const   query = require('../../libraries/database');

tagsRouter.get('/get', (req, res) => {
	query.run('MATCH (n:Tag) RETURN n;')
		.then((results) => {
			res.json(results);
		});
});

tagsRouter.get('/get/:name', (req, res) => {
	query.run('MATCH (n:Tag { name: $name }) RETURN n', {name: req.params.name})
		.then((results) => {
			res.json(results);
		})
		.catch ((err) => console.log(err));
});

module.exports = tagsRouter;
