const paths = require("../config/paths");
const notificationModel = require(paths.MODELS + '/notificationModel');

module.exports = {
    getAllNotifications: async (req, response) => {
        notificationModel
            .getAllNotifications(req.username)
            .then((result) => {
                response
                    .json({
                        status: 200,
                        data: result.map(item => item.props)
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
    },
    readNotif: async (req, response) => {
        notificationModel
            .readNotification(req.username)
            .then(res => {
                response.json({
                    status: 200,
                    data: "success"
                });
            })
            .catch(err => {
                response
                    .status(500)
                    .json({
                        status: 500,
                        msg: 'Error fetching user notifications'
                    });
            })
    }
}