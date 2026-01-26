const { buildEmail } = require("./base")

const postUnbanTemplate = ({ username, date, id, adminUsername, reason }) => {
  const { html, text } = buildEmail({
    preheader: `Your post from ${date} was unbanned.`,
    title: "Post unbanned",
    greeting: `Hi ${username},`,
    intro: "Your post was reviewed again and has been restored.",
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
        title: "Review notes",
        body: reason,
        text: reason,
      },
    ],
    outro: "Thanks for staying with Daykeeper.",
  })

  return {
    subject: `Your post from ${date} was unbanned on Daykeeper`,
    html,
    text,
  }
}

module.exports = postUnbanTemplate
