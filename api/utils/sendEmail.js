import nodemailer from "nodemailer";

export const sendEmail = async (
  subject,
  message,
  send_to,
  sent_from,
  reply_to
) => {
  // create email transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // options for sending email
  const options = {
    from: sent_from,
    to: send_to,
    reply_to: reply_to,
    html: message,
    subject: subject,
  };

  // send the mail
  transporter.sendMail(options, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};
