const nodemailer = require('nodemailer');

require('dotenv').config();

const {
	SMTP_PORT,
	SMTP_HOST,
	SMTP_USER,
	SMTP_PASS,
	DEV_ALL_MAILS_RECIPIENT,
} = process.env; // eslint-disable-line no-process-env, no-undef

module.exports = {
	sendMail: (() => {
		const mailTransporter = nodemailer.createTransport({
			host: SMTP_HOST,
			port: SMTP_PORT,
			secure: true,
			auth: {
				user: SMTP_USER,
				pass: SMTP_PASS,
			},
			tls: {
				// do not fail on invalid certs
				rejectUnauthorized: false,
			},
		});

		return options =>
			mailTransporter.sendMail({
				...options,
				...(DEV_ALL_MAILS_RECIPIENT
					? { to: DEV_ALL_MAILS_RECIPIENT }
					: {}),
			});
	})(),
};
