import nodemailer from 'nodemailer';
import mg from 'nodemailer-mailgun-transport';

const nodemailerMailgun = nodemailer.createTransport(
  mg({
    host: 'api.eu.mailgun.net',
    auth: {
      api_key: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN,
    },
  })
);

export const sendEmail = ({ to, subject, html }) => {
  return new Promise((resolve, reject) => {
    nodemailerMailgun.sendMail(
      {
        from: 'Orca <no-reply@getorca.org>',
        to,
        subject,
        html,
      },
      function (err, info) {
        if (err) {
          console.log('An error occurred while sending an email: ', err);
          return reject(err);
        } else {
          return resolve(info);
        }
      }
    );
  });
};
