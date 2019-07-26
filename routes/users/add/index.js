const	addRouter =  require('express').Router();
const   query = require('../../../libraries/database');
const   express = require('express');

addRouter.use(express.json());


//Add picture
addRouter.post('/pics/:username', (req, res) => {
    const pics = {
        link: req.body.link,
        username: req.params.username,
        date: Date.now()
    };
    query.run('MATCH (u:Users {username: $username}) create (u)-[:UPLOADED]->(p:Picture {link: $link, username: $username, date: $date})', pics);
    res.send(pics.link);
});

module.exports = addRouter;
