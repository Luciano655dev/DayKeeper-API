const nodemailer = require("nodemailer")

const transporterOptions = {
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "daykeepeer655@gmail.com",
    pass: process.env.EMAIL_PASS,
  },
}

const transporter = nodemailer.createTransport(transporterOptions)

const defaultFrom = "Daykeeper <daykeepeer655@gmail.com>"

const sendMail = async ({ to, subject, html, text, replyTo, from }) => {
  try {
    await transporter.sendMail({
      from: from || defaultFrom,
      to,
      subject,
      html,
      text,
      replyTo,
    })
  } catch (error) {
    console.error("Email send failed", {
      to,
      subject,
      message: error?.message,
    })
    return error
  }

  return null
}

module.exports = {
  sendMail,
  defaultFrom,
}
