const nodemailer = require('nodemailer');

const credentials = {
	service: 'gmail',
	auth: {
		user: 'bervelngwenya@gmail.com',
		pass: '9711016103262'
	},
	tls: {
		rejectUnauthorized: false
	},
	debug: true
};

var options = function options(to, subject, message)
{
	var mailOptions = {
		from: '"Matcha" <matcha@info.com>',
		to: to,
		subject: subject,
		html: message
	};
	return mailOptions;
}

function dendMail(options)
{
	console.log(options);
}

module.exports = {
	credentials: credentials,
	options: options
}