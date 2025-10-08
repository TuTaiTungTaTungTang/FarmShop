const nodemailer = require("nodemailer");

const sendMail = async (options) => {
  // Try to use configured SMTP first
  let transporter;
  const hasSmtp = process.env.SMPT_HOST && process.env.SMPT_PORT && process.env.SMPT_MAIL && process.env.SMPT_PASSWORD;

  if (hasSmtp) {
    transporter = nodemailer.createTransport({
      host: process.env.SMPT_HOST,
      port: Number(process.env.SMPT_PORT) || 587,
      service: process.env.SMPT_SERVICE || undefined,
      auth: {
        user: process.env.SMPT_MAIL,
        pass: process.env.SMPT_PASSWORD,
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
    from: process.env.SMPT_MAIL || 'no-reply@example.com',
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
