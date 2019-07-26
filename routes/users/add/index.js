const	addRouter =  require('express').Router();
const   query = require('../../../libraries/database');
const   express = require('express');

addRouter.use(express.json());


// Add picture
addRouter.post('/picture/:username', (req, res) => {
    const pics = {
        link: req.body.link,
        username: req.params.username,
        date: Date.now()
    };
    query
        .run('MATCH (u:User {username: $username}) CREATE (u)-[:UPLOADED]->(p:Picture {link: $link, username: $username, date: $date})', pics)
        .then(res.send("Image added"))
		.catch((err) => console.log(err));
});

//	Add tag
addRouter.post('/tag/:username', (req, res) => {
	const params = {
		username: req.params.username,
		name: req.body.tagName
	};
    query
		.run('MATCH (u:User {username: $username}) CREATE (u)-[:INTRESTED_IN]->(p:Tag {name: $name})', params)
		.catch((err) => console.log(err));
});

module.exports = addRouter;
