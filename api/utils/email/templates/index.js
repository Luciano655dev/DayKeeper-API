const { buildEmail, escapeHtml } = require("./base")
const verificationTemplate = require("./verification")
const passwordResetTemplate = require("./passwordReset")
const banTemplate = require("./ban")
const unbanTemplate = require("./unban")
const userDeletionTemplate = require("./userDeletion")
const postBanTemplate = require("./postBan")
const postUnbanTemplate = require("./postUnban")
const postDeletionTemplate = require("./postDeletion")
const accountDeletionTemplate = require("./accountDeletion")

module.exports = {
  buildEmail,
  escapeHtml,
  verificationTemplate,
  passwordResetTemplate,
  banTemplate,
  unbanTemplate,
  userDeletionTemplate,
  postBanTemplate,
  postUnbanTemplate,
  postDeletionTemplate,
  accountDeletionTemplate,
}
