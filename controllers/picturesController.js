const pictureModel = require('../models/pictureModel');

module.exports = {
    getUserPics: async (req, response) => {
        const params = {
            username: req.params.username
        };
        pictureModel
            .then((result) => {
                response
                    .json({
                        status: 200,
                        data: result
                    });
            })
            .catch((err) => {
                console.log(err.message);
                response
                    .json({
                        status: 404,
                        msg: "picture not found!"
                    });
            });
    }
}