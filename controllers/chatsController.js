const paths = require("../config/paths");
const chatModel = require(paths.MODELS + '/chatModel');

module.exports = {
    getUserChats: async (req, response) => {
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
                    .status(500)
                    .json({
                        status: 500,
                        msg: 'Error fetching user chats'
                    });
            });
    }
};