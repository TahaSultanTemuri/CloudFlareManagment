const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" }); // SETTING ENV VARIABLE

const getTransport = () => {
  const config = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };

  return nodemailer.createTransport(config);
};

exports.throughMail = async (from, to, subject, type, value) => {
  const transporter = getTransport();

  try {
    const mailOptions = {
      from,
      to,
      subject,
    };

    if (type === "html") mailOptions.html = value;
    else mailOptions.text = value;

    await transporter.sendMail(mailOptions);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
