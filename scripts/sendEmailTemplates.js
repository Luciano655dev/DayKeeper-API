require("dotenv").config()

const { sendMail } = require("../api/utils/email/mailer")
const {
  verificationTemplate,
  passwordResetTemplate,
  banTemplate,
  unbanTemplate,
  userDeletionTemplate,
  postBanTemplate,
  postUnbanTemplate,
  postDeletionTemplate,
} = require("../api/utils/email/templates")

const to = process.env.EMAIL_TEST_TO || "lucianomenezes655@gmail.com"

const today = new Date()
const dateLabel = today.toISOString().slice(0, 10)

const sampleData = {
  username: "Luciano",
  adminUsername: "DaykeeperAdmin",
  reason: "Violation of community guidelines.",
  message: "Please contact support if you have questions.",
  date: dateLabel,
  id: "post_12345",
  verificationCode: "123456",
  imgSrc: "",
}

const templates = [
  {
    name: "verification",
    build: () =>
      verificationTemplate({
        username: sampleData.username,
        imgSrc: sampleData.imgSrc,
        verificationCode: sampleData.verificationCode,
      }),
  },
  {
    name: "passwordReset",
    build: () =>
      passwordResetTemplate({
        verificationCode: sampleData.verificationCode,
      }),
  },
  {
    name: "ban",
    build: () =>
      banTemplate({
        username: sampleData.username,
        reason: sampleData.reason,
      }),
  },
  {
    name: "unban",
    build: () =>
      unbanTemplate({
        username: sampleData.username,
        reason: sampleData.reason,
      }),
  },
  {
    name: "userDeletion",
    build: () =>
      userDeletionTemplate({
        username: sampleData.username,
        adminUsername: sampleData.adminUsername,
        reason: sampleData.reason,
        message: sampleData.message,
      }),
  },
  {
    name: "postBan",
    build: () =>
      postBanTemplate({
        username: sampleData.username,
        date: sampleData.date,
        id: sampleData.id,
        adminUsername: sampleData.adminUsername,
        reason: sampleData.reason,
      }),
  },
  {
    name: "postUnban",
    build: () =>
      postUnbanTemplate({
        username: sampleData.username,
        date: sampleData.date,
        id: sampleData.id,
        adminUsername: sampleData.adminUsername,
        reason: sampleData.reason,
      }),
  },
  {
    name: "postDeletion",
    build: () =>
      postDeletionTemplate({
        username: sampleData.username,
        date: sampleData.date,
        id: sampleData.id,
        adminUsername: sampleData.adminUsername,
        reason: sampleData.reason,
        message: sampleData.message,
      }),
  },
]

const sendAll = async () => {
  for (const template of templates) {
    const { subject, html, text } = template.build()
    const error = await sendMail({
      to,
      subject: `[Template: ${template.name}] ${subject}`,
      html,
      text,
    })

    if (error) {
      console.error(`Failed to send ${template.name}`, error)
    } else {
      console.log(`Sent ${template.name} to ${to}`)
    }
  }
}

sendAll()
  .then(() => {
    console.log("Done")
  })
  .catch((error) => {
    console.error("Template send failed", error)
    process.exitCode = 1
  })
