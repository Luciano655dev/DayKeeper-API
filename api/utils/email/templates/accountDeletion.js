const { buildEmail } = require("./base")

const accountDeletionTemplate = ({ code }) => {
  const { html, text } = buildEmail({
    preheader: "Use this code to confirm account deletion.",
    title: "Confirm account deletion",
    greeting: "Hi there,",
    intro:
      "You requested to delete your Daykeeper account. Use the code below to confirm.",
    code,
    outro:
      "If you did not request this, you can ignore this email.",
  })

  return {
    subject: "Confirm your Daykeeper account deletion",
    html,
    text,
  }
}

module.exports = accountDeletionTemplate
