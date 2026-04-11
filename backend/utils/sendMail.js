const nodemailer = require("nodemailer");

let cachedTransporter = null;
let cachedMode = null;

const createSmtpTransporter = () => {
  return nodemailer.createTransport({
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
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 12000,
  });
};

const createEtherealTransporter = async () => {
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 12000,
  });
};

const getTransporter = async () => {
  if (cachedTransporter) {
    return { transporter: cachedTransporter, mode: cachedMode };
  }

  const hasSmtp =
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_MAIL &&
    process.env.SMTP_PASSWORD;

  if (hasSmtp) {
    cachedTransporter = createSmtpTransporter();
    cachedMode = "smtp";
    return { transporter: cachedTransporter, mode: cachedMode };
  }

  if (process.env.NODE_ENV !== "production") {
    cachedTransporter = await createEtherealTransporter();
    cachedMode = "ethereal";
    console.info("Using Ethereal test account for email (dev).");
    return { transporter: cachedTransporter, mode: cachedMode };
  }

  throw new Error("No valid email transporter configured");
};

const sendMail = async (options) => {
  const { transporter, mode } = await getTransporter();

  const mailOptions = {
    from: process.env.SMTP_MAIL || "no-reply@example.com",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  let info;
  try {
    info = await transporter.sendMail(mailOptions);
  } catch (error) {
    if (mode === "smtp") {
      // clear broken cached transporter so next call can retry with fresh connection
      cachedTransporter = null;
      cachedMode = null;
    }
    throw error;
  }

  // If using Ethereal, log the preview URL
  if (mode === "ethereal" && process.env.NODE_ENV !== "production" && info && info.messageId) {
    try {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) console.info("Ethereal preview URL:", previewUrl);
    } catch (e) {
      // ignore
    }
  }
};

module.exports = sendMail;
