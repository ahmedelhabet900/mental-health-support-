import nodemailer from "nodemailer";
import { getOtpEmailHtml } from "../utils/tempelet.js";

const sendEmail = async (email, subject, otp) => {
  const transportrt = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "ahmedelhabet900@gmail.com",
      pass: "lczx jlai iplz lpyr",
    },
  });

  const info = await transportrt.sendMail({
    from: `"Reveal" <ahmedelhabet900@gmail.com>`,
    to: email,
    subject,
    html: getOtpEmailHtml(otp),
  });

  console.log("Message sent: %s", info.messageId);
};

export default sendEmail;

// import nodemailer from "nodemailer";
// import { getOtpEmailHtml } from "./template.js";

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
// });

// const sendEmail = async (email, subject, otp) => {
//   await transporter.sendMail({
//     from: `"MIORA" <${process.env.EMAIL_USER}>`,
//     to: email,
//     subject,
//     html: getOtpEmailHtml(otp),
//   });
// };

// export default sendEmail;



// import nodemailer from "nodemailer";
// import { getOtpEmailHtml } from "./tempelet.js";

// // const transporter = nodemailer.createTransport({
// //   host: "smtp.gmail.com",
// //   port: 465,
// //   secure: true,
// //   auth: {
// //     user: process.env.EMAIL_USER,
// //     pass: process.env.EMAIL_PASS,
// //   },
// // });
// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   family: 4,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });
// const sendEmail = async (email, subject, otp) => {
//   const info = await transporter.sendMail({
//     from: `"MIORA" <${process.env.EMAIL_USER}>`,
//     to: email,
//     subject,
//     html: getOtpEmailHtml(otp),
//   });

//   console.log("Message sent: %s", info.messageId);
// };

// export default sendEmail;