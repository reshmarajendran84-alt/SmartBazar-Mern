import nodemailer from "nodemailer";

const sendEmail = async (to, otp) => {
  try {
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();
    console.log("SMTP Ready");

    await transporter.sendMail({
      from: `"SmartBazar" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Your OTP Code",
      html: `
        <h2>Your OTP is ${otp}</h2>
        <p>This OTP is valid for 5 minutes.</p>
      `,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("MAIL ERROR:", error);
    throw new Error(error.message);
  }
};

export default sendEmail;