module.exports = {
	username: (username) => {
		console.log(username);
		if (!username)
			return "Please enter a username";

		return (!username.match(/^[a-zA-Z]+[\w]*$/))
			? "Username start with a letter and can only contain letters or numbers or underscores"
			: "";
	},
	email: (email) => {
		console.log(email);
		return (!email ||
				!email.match(
					/^[\w.!#$%&'*\+\/=?\^`{|}~-]+@(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/
				))
			? "Please enter a valid e-mail"
			: "";
	},
	lastName: (lastName) => {
		console.log(lastName);
		if (!lastName)
			return "Please enter your last name";

		return (lastName.match(/^[a-zA-Z]+[A-Za-z\-]*$/) === null)
			? "A name start with a letter and can only contain letters or dashes"
			: "";
	},
	firstName: (firstName) => {
		console.log(firstName);
		if (!firstName)
			return "Please enter your first name";

		return (!firstName.match(/^[a-zA-Z][A-Za-z\-]*$/))
			? "A name start with a letter and can only contain letters or dashes"
			: "";
	}
};
