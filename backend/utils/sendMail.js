const nodemailer = require("nodemailer");

const sendMail = async (options) => {
  // Try to use configured SMTP first
  let transporter;
  const hasSmtp = process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_MAIL && process.env.SMTP_PASSWORD;

  if (hasSmtp) {
    transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  service: process.env.SMTP_SERVICE || undefined,
      auth: {
  user: process.env.SMTP_MAIL,
  pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    try {
      // verify transporter works
      await transporter.verify();
    } catch (verifyErr) {
      console.error('SMTP verify failed:', verifyErr && verifyErr.message ? verifyErr.message : verifyErr);
      transporter = null;
    }
  }

  // If no working SMTP and in dev, create an Ethereal account
  if (!transporter && process.env.NODE_ENV !== 'production') {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.info('Using Ethereal test account for email (dev).');
  }

  if (!transporter) {
    throw new Error('No valid email transporter configured');
  }

  const mailOptions = {
  from: process.env.SMTP_MAIL || 'no-reply@example.com',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  const info = await transporter.sendMail(mailOptions);

  // If using Ethereal, log the preview URL
  if (process.env.NODE_ENV !== 'production' && info && info.messageId) {
    try {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) console.info('Ethereal preview URL:', previewUrl);
    } catch (e) {
      // ignore
    }
  }
};

module.exports = sendMail;
