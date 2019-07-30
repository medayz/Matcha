const notificationModel = require('../models/notificationModel');

module.exports = {
    getAllNotifications: async (req, response) => {
        notificationModel
            .getAllNotifications(req.params.username)
            .then((result) => {
                response
                    .status(200)
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
                        msg: 'Error fetching user notifications'
                    });
            });
    }
}