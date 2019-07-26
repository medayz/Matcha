const	picsRouter =  require('express').Router();
const   query = require('../../libraries/database');

picsRouter.get('/:username', (req, res) => {
    const pics = {
        username: req.params.username
    };
    //res.send(pics.username);
    const data = query.run('MATCH (a:Users {username: $username})-[:UPLOADED]->(p:Picture) return p', pics);
    data.then( (result) => {
        res.json(result);
    }).catch((err) => {
         res.send("segFault")
    });
});
        
module.exports = picsRouter;
