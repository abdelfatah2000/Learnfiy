const nodemailer = require('nodemailer');

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      service: process.env.EMAIL_HOST,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    let info = await transporter.sendMail({
      from: 'Learnify',
      to: email,
      subject: title,
      html: body,
    });
    // console.log('Email info: ', info.response);
    return info;
  } catch (err) {
    console.log(err);
  }
};
module.exports = mailSender;
