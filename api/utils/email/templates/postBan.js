const { buildEmail } = require("./base")

const postBanTemplate = ({ username, date, id, adminUsername, reason }) => {
  const { html, text } = buildEmail({
    preheader: `Your post from ${date} was banned.`,
    title: "Post banned",
    greeting: `Hi ${username},`,
    intro:
      "Your post was reviewed by our team and has been temporarily removed.",
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
        title: "Reason provided",
        body: reason,
        text: reason,
      },
    ],
    outro:
      "If you believe this was a mistake, reply within 7 days. Otherwise the post may be removed permanently.",
  })

  return {
    subject: `Your post from ${date} was banned on Daykeeper`,
    html,
    text,
  }
}

module.exports = postBanTemplate
