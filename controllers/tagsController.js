const paths = require("../config/paths");
const tagModel = require(paths.MODELS + '/tagModel');

module.exports = {
    getAllTags: async (req, response) => {
        console.log(req.username);
        tagModel
            .getAllTags()
            .then((results) => {
                response
                    .json({
                        status: 200,
                        data: results
                    });
            })
            .catch((err) => {
                console.log(err.message);
                response
                    .status(500)
                    .json({
                        status: 500,
                        msg: 'Error fetching tags'
                    })
            });
    },
    getTagByName: async (req, response) => {
        tagModel
            .getTagByName(req.params.name)
            .then((results) => {
                response
                    .json({
                        status: 200,
                        data: results
                    });
            })
            .catch((err) => {
                console.log(err.message);
                response
                    .status(500)
                    .json({
                        status: 500,
                        msg: 'Error fetching tag by name'
                    });
            });
    }
};