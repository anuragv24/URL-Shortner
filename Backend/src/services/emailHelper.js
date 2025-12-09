import { sendMail } from "./emailService.js";

export const sendVerificationEmail = async (name, email, otp) => {
    const message = `Your verification code is: ${otp}. This code expires in 10 minutes.`;
    await sendMail({
        to: email,
        subject: "Your Verification Code",
        text: message,
        html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Hello ${name},</h2>
            <p>Your verification code is:</p>
            <h1 style="color: #4F46E5; letter-spacing: 5px;">${otp}</h1>
            <p>This code expires in 10 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <br>
            <p>Thanks,<br>${process.env.APP_NAME}</p>
        </div>`
    });
};