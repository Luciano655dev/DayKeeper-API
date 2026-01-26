const { buildEmail } = require("./base")

const verificationTemplate = ({ username, imgSrc = "", verificationCode }) => {
  const { html, text } = buildEmail({
    preheader: "Use the code to confirm your email.",
    title: "Confirm your email",
    greeting: `Hi ${username},`,
    intro:
      "Thanks for creating your Daykeeper account. Use the code below to verify your email.",
    code: verificationCode,
    avatarUrl: imgSrc,
    outro:
      "If you did not create an account, you can ignore this email. Need help? Just reply here.",
  })

  return {
    subject: "Confirm your email on Daykeeper",
    html,
    text,
  }
}

module.exports = verificationTemplate
