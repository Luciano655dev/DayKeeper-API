const { sendMail } = require("./email/mailer")
const {
  verificationTemplate,
  passwordResetTemplate,
  banTemplate,
  unbanTemplate,
  userDeletionTemplate,
  postBanTemplate,
  postUnbanTemplate,
  postDeletionTemplate,
  accountDeletionTemplate,
} = require("./email/templates")

async function sendVerificationEmail(
  username,
  email,
  imgSrc = "",
  verificationCode
) {
  const { subject, html, text } = verificationTemplate({
    username,
    imgSrc,
    verificationCode,
  })

  await sendMail({
    to: email,
    subject,
    html,
    text,
  })
}

const sendPasswordResetEmail = async (email, verificationCode) => {
  const { subject, html, text } = passwordResetTemplate({
    verificationCode,
  })

  await sendMail({
    to: email,
    subject,
    html,
    text,
  })
}

const sendBanEmail = async ({ username, email, reason }) => {
  const { subject, html, text } = banTemplate({
    username,
    reason,
  })

  await sendMail({
    to: email,
    subject,
    html,
    text,
  })
}

const sendUnbanEmail = async ({ username, email, reason }) => {
  const { subject, html, text } = unbanTemplate({
    username,
    reason,
  })

  await sendMail({
    to: email,
    subject,
    html,
    text,
  })
}

const sendUserDeletionEmail = async ({
  username,
  email,
  adminUsername,
  reason,
  message,
}) => {
  const { subject, html, text } = userDeletionTemplate({
    username,
    adminUsername,
    reason,
    message,
  })

  await sendMail({
    to: email,
    subject,
    html,
    text,
  })
}

// ========== POST ==========
const sendPostBanEmail = async ({
  username,
  email,
  date,
  id,
  adminUsername,
  reason,
}) => {
  const { subject, html, text } = postBanTemplate({
    username,
    date,
    id,
    adminUsername,
    reason,
  })

  await sendMail({
    to: email,
    subject,
    html,
    text,
  })
}

const sendPostUnbanEmail = async ({
  username,
  email,
  date,
  id,
  adminUsername,
  reason,
}) => {
  const { subject, html, text } = postUnbanTemplate({
    username,
    date,
    id,
    adminUsername,
    reason,
  })

  await sendMail({
    to: email,
    subject,
    html,
    text,
  })
}
const sendPostDeletionEmail = async ({
  username,
  email,
  date,
  id,
  adminUsername,
  reason,
  message,
}) => {
  const { subject, html, text } = postDeletionTemplate({
    username,
    date,
    id,
    adminUsername,
    reason,
    message,
  })

  await sendMail({
    to: email,
    subject,
    html,
    text,
  })
}

const sendAccountDeletionCode = async (email, code) => {
  const { subject, html, text } = accountDeletionTemplate({ code })

  await sendMail({
    to: email,
    subject,
    html,
    text,
  })
}

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,

  sendBanEmail,
  sendUnbanEmail,
  sendUserDeletionEmail,

  sendPostBanEmail,
  sendPostUnbanEmail,
  sendPostDeletionEmail,
  sendAccountDeletionCode,
}
