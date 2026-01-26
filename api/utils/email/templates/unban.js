const { buildEmail } = require("./base")

const unbanTemplate = ({ username, reason }) => {
  const { html, text } = buildEmail({
    preheader: "Your account was unbanned.",
    title: "Account unbanned",
    greeting: `Hi ${username},`,
    intro: "Good news! Your account was reviewed and the ban was removed.",
    sections: [
      {
        title: "Review notes",
        body: reason,
        text: reason,
      },
      {
        title: "What happens now",
        body: "Your account, posts, and interactions have been restored.",
        text: "Your account, posts, and interactions have been restored.",
      },
    ],
    outro: "Sorry for the inconvenience, and thanks for your patience.",
  })

  return {
    subject: `Your ${username} account was unbanned on Daykeeper`,
    html,
    text,
  }
}

module.exports = unbanTemplate
