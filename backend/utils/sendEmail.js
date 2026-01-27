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
      from: `"SmartBazar Auth" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Your OTP Code",
      html: `<h2>Your OTP is: ${otp}</h2><p>It is valid for 5 minutes.</p>`,
    });

    console.log(`OTP sent to ${to}: ${otp}`);
  } catch (err) {
    console.error("Email send error:", err);
    throw new Error("Failed to send OTP email");
  }
};

export default sendEmail;
