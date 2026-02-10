// import nodemailer from "nodemailer";

// const sendEmail = async (to, otp) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: "reshmarajendran84@gmail.com",
//         pass: "xkzczklnkxjqqlhq",
//       },
//     });

//     await transporter.verify(); 

//     await transporter.sendMail({
//       from: `"SmartBazar" reshmarajendran84@gmail.com`,
//       to,
//       subject: "Your OTP Code",
//       html: `
//         <h2>Your OTP is ${otp}</h2>
//         <p>This OTP is valid for 5 minutes.</p>
//       `,
//     });

//     console.log("✅ OTP email sent to:", to);
//   } catch (error) {
//     console.error("❌ Email error:", error.message);
//     throw new Error("Email sending failed");
//   }
// };

// export default sendEmail;
import nodemailer from "nodemailer";

const sendEmail = async (to, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"SmartBazar" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Your OTP Code",
      html: `
        <h2>Your OTP is ${otp}</h2>
        <p>This OTP is valid for 5 minutes.</p>
      `,
    });
  } catch (error) {
    throw new Error("Email sending failed");
  }
};

export default sendEmail;
