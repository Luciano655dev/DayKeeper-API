const { buildEmail } = require("./base")

const postDeletionTemplate = ({
  username,
  date,
  id,
  adminUsername,
  reason,
  message,
}) => {
  const { html, text } = buildEmail({
    preheader: `Your post from ${date} was permanently deleted.`,
    title: "Post deleted",
    greeting: `Hi ${username},`,
    intro:
      "Because there was no appeal or the review confirmed a violation, your post was permanently removed.",
    sections: [
      {
        title: "Post details",
        body: `Date: ${date}\nID: ${id}`,
        text: `Date: ${date} | ID: ${id}`,
      },
      {
        title: "Reviewed by",
        body: `Reviewed by ${adminUsername}`,
        text: `Reviewed by ${adminUsername}`,
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
    outro: "Unfortunately this action cannot be reversed.",
  })

  return {
    subject: `Your post from ${date} was deleted on Daykeeper`,
    html,
    text,
  }
}

module.exports = postDeletionTemplate
