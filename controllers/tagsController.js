const tagModel = require('../models/tagModel');

module.exports = {
    getAllTags: async (req, response) => {
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