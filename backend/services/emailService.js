// services/emailService.js
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendEmail = async ({ to, subject, html }) => {
  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM, // onboarding@resend.dev
      to,
      subject,
      html,
    });

    return result;
  } catch (err) {
    console.error("Email Error:", err);
    throw err;
  }
};