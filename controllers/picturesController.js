const paths = require("../config/paths");
const pictureModel = require(`${paths.MODELS}/pictureModel`);

module.exports = {
	getUserPics: async (req, response) => {
		console.log('getting pics...');
		const params = {
			username: req.params.username
		};
		pictureModel
			.getUserPics(params)
			.then(result => {
				console.log(result);
				response
					.json({
						status: 200,
						data: result
					});
			})
			.catch((err) => {
				console.log('CONTROLLER:', err.message);
				response
					.status(500)
					.json({
						status: 500,
						msg: "Error fetching pictures!"
					});
			});
	},
	countUserPics: async (req, response) => {
		const params = {
			username: req.params.username
		};
		pictureModel
			.countUserPics(params)
			.then((result) => {
				response
					.json({
						status: 200,
						data: result
					});
			})
			.catch(err => console.log(err.message));
	},
}