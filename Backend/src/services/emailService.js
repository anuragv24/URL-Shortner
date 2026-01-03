import nodemailer from "nodemailer"
import {ApiError} from '../utils/apiErrorHandler.js'

export const sendMail = async(options) => {

    const transporter = nodemailer.createTransport({
        // service: "gmail",
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        logger: process.env.NODE_ENV !== 'production',
        debug: process.env.NODE_ENV !== 'production',
    })

    const mailOptions = {
        from: `"${process.env.APP_NAME}" <${process.env.EMAIL_FROM}>`,
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


