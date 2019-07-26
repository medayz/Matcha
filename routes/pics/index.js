const	picsRouter =  require('express').Router();
const   query = require('../../libraries/database');

picsRouter.get('/get/:username', (req, res) => {
    const pics = {
        username: req.params.username
    };
    const data = query.run('MATCH (a:User {username: $username})-[:UPLOADED]->(p:Picture) return p', pics);
    data.then( (result) => {
        res.json(result);
    }).catch((err) => {
         res.send("picture not found!");
    });
});
        
module.exports = picsRouter;
