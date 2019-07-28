const Generator = require('uuid-token-generator');
 
module.exports.get = () => {
	const token = new Generator();
	return token.generate();
}
