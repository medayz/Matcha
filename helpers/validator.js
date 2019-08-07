module.exports = {
	username: (username, found) => {
		if (!username)
			return "Please enter a username";
		if (found)
			return "Username already taken!";

		return (!username.match(/^[a-zA-Z]+[\w]*$/)) ?
			"Username start with a letter and can only contain letters or numbers or underscores" :
			"";
	},
	email: (email, found) => {
		if (found)
			return "email already linked to another account!";

		return (!email ||
				!email.match(
					/^[\w.!#$%&'*\+\/=?\^`{|}~-]+@(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/
				)) ?
			"Please enter a valid e-mail" :
			"";
	},
	lastName: (lastName) => {
		if (!lastName)
			return "Please enter your last name";

		return (lastName.match(/^[a-zA-Z]+[A-Za-z\-]*$/) === null) ?
			"A name start with a letter and can only contain letters or dashes" :
			"";
	},
	firstName: (firstName) => {
		if (!firstName)
			return "Please enter your first name";

		return (!firstName.match(/^[a-zA-Z][A-Za-z\-]*$/)) ?
			"A name start with a letter and can only contain letters or dashes" :
			"";
	},
	password: (pwd) => {
		if (!pwd)
			return "Please enter a password";

		return (pwd.length < 6 ||
				!pwd.match(/[a-z]/) ||
				!pwd.match(/[A-Z]/) ||
				!pwd.match(/[0-9]/)) ?
			"The password must be 6 characters long and must contain an uppercase, a lowercase and a digit" :
			"";
	},
	confirmPassword: (pwd, conf_pwd) => {
		if (!conf_pwd)
			return "Please confirm your password";

		return (pwd !== conf_pwd) ?
			"This doesn't match the password you entered above" :
			"";
	}
};