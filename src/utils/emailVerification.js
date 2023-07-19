const nodemailer = require("nodemailer");

exports.verifyEmail = async (sendMailBody) => {
  console.log(
    "🚀 ~ file: emailVerification.js:4 ~ exports.verifyEmail= ~ sendMail:",
    sendMailBody
  );
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "srabonfb@gmail.com",
        pass: "oyitemxuanxdzxhd",
      },
    });
    // send email
    let info = await transporter.sendMail({
      from: "srabonfb@gmail.com",
      to: sendMailBody?.email, //receciver
      subject: sendMailBody?.subject,
      html: sendMailBody?.html,
    });
    console.log("mail send");
  } catch (error) {
    console.log({ error });
  }
};
