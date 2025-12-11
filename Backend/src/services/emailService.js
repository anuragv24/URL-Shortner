import nodemailer from "nodemailer"
import {ApiError} from '../utils/apiErrorHandler.js'

export const sendMail = async(options) => {
    console.log(`Checking Env: User='${process.env.EMAIL_USER}' PassLength=${process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0}`);

    const transporter = nodemailer.createTransport({
        // service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        family: 4,
        tls: {
            rejectUnauthorized: false
        },
        connectionTimeout: 60000,
        greetingTimeout: 30000,
        socketTimeout: 60000
        
    })

    const mailOptions = {
        from: `"${process.env.APP_NAME}" <${process.env.EMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html
    }

    try {
        const info = await transporter.sendMail(mailOptions)
        console.log(`Email sent: ${info.messageId}`)
    } catch (error) {
        console.error("Error sending email:", error)
        throw new ApiError(500 ,"Something went wrong while sending the email. Please try again later")
    }

}


