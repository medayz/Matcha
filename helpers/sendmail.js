const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
module.exports.send = async (mailInfos) => {

	// create reusable transporter object using the default SMTP transport
	let transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 587,
		secure: false, // true for 465, false for other ports
		auth: {
			user: "est36berrechid@gmail.com", // generated ethereal user
			pass: "estberrechid36" // generated ethereal password
		}
	});

	// send mail with defined transport object
	let info = await transporter.sendMail({
		from: '"Matcha 🍆 " <est36berrechid@gmail.com>', // sender address
		to: mailInfos.receiver, // list of receivers
		subject: mailInfos.subject, // Subject line
		text: mailInfos.body, // plain text body
		html: mailInfos.html // html body
	});

	return true;
};
