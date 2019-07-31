const chatModel = require('../models/locationModel');

module.exports = {
    getUserLocations: async (req, response) => {
        chatModel
            .getUserChats(req.params.username)
            .then(result => {
                response
                    .json({
                        status: 200,
                        data: result
                    });
            })
            .catch(err => {
                console.log(err.message);
                response
                    .json({
                        status: 500,
                        msg: 'Error fetching user locations'
                    });
            });
    }
};