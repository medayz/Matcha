const	bcrypt = require('bcryptjs');
const	saltRounds = 10;

module.exports = {
	hash: async (pwd) => {
		return await bcrypt.hash(pwd, saltRounds);
	},
	verify: async (pwd, hash) => {
		return await bcrypt.compare(pwd, hash);
	}
};
