const { buildEmail } = require("./base")

const userDeletionTemplate = ({ username, adminUsername, reason, message }) => {
  const { html, text } = buildEmail({
    preheader: "Your account was permanently removed.",
    title: "Account deleted",
    greeting: `Hi ${username},`,
    intro:
      "After a team review, your Daykeeper account was permanently removed.",
    sections: [
      {
        title: "Reviewed by",
        body: adminUsername,
        text: adminUsername,
      },
      {
        title: "Reason",
        body: reason,
        text: reason,
      },
      {
        title: "Additional notes",
        body: message,
        text: message,
      },
    ],
    outro: "All associated information was removed and cannot be restored.",
  })

  return {
    subject: `Your "${username}" account was deleted on Daykeeper`,
    html,
    text,
  }
}

module.exports = userDeletionTemplate
