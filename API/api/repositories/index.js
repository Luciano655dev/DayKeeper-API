const searchPostPipeline = require('./searchPostPipeline')
const searchUserPipeline = require(`./searchUserPipeline`)
const userPostsPipeline = require(`./userPostsPipeline`)
const reportedElementPipeline = require(`./reportedElementPipeline`)
const bannedElementPipeline = require(`./bannedElementPipeline`)

module.exports = {
  hideUserData: {
    password: false,
    ban_history: false,
    reports: false,
    follow_requests: false,
    blocked_users: false,
    verified_email: false,
    roles: false,
    banned: false
  },
  hidePostData: {
    reportd: false,
    ban_history: false,
  },
  hideStorieData: {
    views: 0,
    likes: 0
  },
  hideGeneralData: {
    banned: 0,
    ban_history: 0,
    reports: 0
  },
  searchPostPipeline,
  searchUserPipeline,
  userPostsPipeline,
  reportedElementPipeline,
  bannedElementPipeline
}