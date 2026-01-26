const { buildEmail } = require("./base")

const passwordResetTemplate = ({ verificationCode }) => {
  const { html, text } = buildEmail({
    preheader: "Use the code to reset your password.",
    title: "Password reset",
    greeting: "Hi there,",
    intro:
      "We received a request to reset your password. Use the code below to continue.",
    code: verificationCode,
    outro:
      "If you did not request this, you can ignore this email. Your password stays secure.",
  })

  return {
    subject: "Password reset for Daykeeper",
    html,
    text,
  }
}

module.exports = passwordResetTemplate
