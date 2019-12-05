const NodeGeocoder = require("node-geocoder");

const options = {
  provider: "google",

  httpAdapter: "https",
  apiKey: "AIzaSyBc39oUNubkrmDpYhBqBtxjmTDhYcllEec",
  formatter: null
};

const geocoder = NodeGeocoder(options);

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
	bio: (bio) => {
		return bio.length > 100 ?
			"The bio can't contain more than 100 characters"
			: "";
	},
	birthDate: (birthDate) => {
		if (!birthDate)
			return "Please enter your birth date";

		const matches = birthDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
		if (!matches)
			return ("The date you entered is not valid!");
		let [date, year, month, day] = matches;
		[year, month, day] = [parseInt(year), parseInt(month), parseInt(day)];
		const leap = year % 4 ?
			false
			: ( year % 100 ?
			true
			: (year % 400 ?
				false
				:true
			)
		);
		const months = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		months[2] += leap;
		const error = month && day && day <= months[month] ? false : true;

		return (error ? 'The date you entered is not valid!' : '');
	},
	place: (place, lon, lat) => {
		if (!Array.isArray(place))
			return lon === null || lat === null ?
				"Please enter your location"
				: "";

		const {longitude, latitude} = place[0] || {};
		return (typeof longitude === 'undefined' && typeof latitude === 'undefined') ?
			"The location you entered is not valid"
			: ""
	},
	gender: (gender) => {
		if (!gender)
			return "Please enter your gender";

		return !["Male", "Female", "Other"].includes(gender) ?
			"Please choose your gender from the suggested list"
			: "";
	},
	sexualPref: (sexualPref) => {
		if (!sexualPref)
			return "Please enter your sexual preference";

		return !["Men", "Women", "Everyone"].includes(sexualPref) ?
			"Please choose your sexual preference from the suggested list"
			: "";
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