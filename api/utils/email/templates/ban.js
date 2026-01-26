const { buildEmail } = require("./base")

const banTemplate = ({ username, reason }) => {
  const { html, text } = buildEmail({
    preheader: "Your account was banned.",
    title: "Account banned",
    greeting: `Hi ${username},`,
    intro:
      "Your account was reviewed by our team and has been banned from Daykeeper.",
    sections: [
      {
        title: "Reason provided",
        body: reason,
        text: reason,
      },
      {
        title: "Appeal",
        body: "If you believe this was a mistake, reply to this email to request a review.",
        text: "If you believe this was a mistake, reply to this email to request a review.",
      },
    ],
    outro:
      "If no appeal is requested, your account and interactions may be permanently removed within 30 days.",
  })

  return {
    subject: `Your ${username} account was banned on Daykeeper`,
    html,
    text,
  }
}

module.exports = banTemplate
