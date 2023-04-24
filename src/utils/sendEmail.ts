import * as nodemailer from 'nodemailer';
import env from 'src/env';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.EMAIL_ADDRESS, // boldoo@gmail.com
    pass: env.EMAIL_PASSWORD, // boldoogiinpassword
  },
});

export const sendEmail = (to: string, subject: string, message: string) =>
  new Promise((resolve, reject) => {
    const mailOptions = {
      from: env.EMAIL_ADDRESS,
      to: to,
      subject: subject,
      text: message,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        reject(error.message);
      } else {
        resolve('Email sent: ' + info.response);
      }
    });
  });
