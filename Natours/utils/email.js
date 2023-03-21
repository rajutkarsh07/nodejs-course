const nodemailer = require('nodemailer');

// const sendEmail = async (options) => {
//   //first create transporter
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     auth: {
//       user: 'process.env.EMAIL_USERNAME',
//       pass: 'process.env.EMAIL_PASSWORD',
//     },
//   });

//   // then define email options
//   const mailOptions = {
//     from: 'utkarsh raj <rajutkarsh2505@gmail.com>',
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//     // html:,
//   };

//   // console.log('sending mail');
//   // then send the email
//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;

const sendEmail = (options) => {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'impostercrewfreedom@gmail.com',
      pass: 'avuwpktrouxkalqw',
    },
  });
  var mailoptions = {
    from: 'impostercrewfreedom@gmail.com',
    to: options.toEmail,
    subject: 'reset password for your account',
    html: `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Document</title>
        </head>
        <body>
          <img width="250" height="250" src="https://img.freepik.com/premium-vector/forgot-password-concept-isolated-white_263070-194.jpg" alt="" />
          <p>your password reset link is</p>
          ${options.message}.
        </body>
      </html>
      `,
  };
  transporter.sendMail(mailoptions, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Email send: ' + result.response);
    }
  });
};
// console.log(username)

module.exports = sendEmail;
