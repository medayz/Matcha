const nodemailer = require("nodemailer");

module.exports.send = async (mailInfos) => {

	let transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 587,
		secure: false,
		auth: {
			user: "est36berrechid@gmail.com",
			pass: "estberrechid36"
		}
	});

	let info = await transporter.sendMail({
		from: '"Matcha 🍆 " <est36berrechid@gmail.com>',
		to: mailInfos.receiver,
		subject: mailInfos.subject,
		text: mailInfos.body,
		html: mailInfos.html
	});

	return true;
};
