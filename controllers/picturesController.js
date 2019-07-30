const pictureModel = require('../models/pictureModel');

module.exports = {
    getUserPics: async (req, response) => {
        const params = {
            username: req.params.username
        };
        pictureModel
            .then((result) => {
                response
                    .status(200)
                    .json({
                        status: 200,
                        data: result
                    });
            })
            .catch((err) => {
                console.log(err.message);
                response
                    .status(404)
                    .json({
                        status: 404,
                        msg: "picture not found!"
                    });
            });
    }
}