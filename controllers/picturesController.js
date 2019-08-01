const pictureModel = require('../models/pictureModel');

module.exports = {
    getUserPics: async (req, response) => {
        const params = {
            username: req.params.username
        };
        pictureModel
            .getUserPics(params)
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
                    .status(500)
                    .json({
                        status: 500,
                        msg: "Error fetching pictures!"
                    });
            });
    }
}