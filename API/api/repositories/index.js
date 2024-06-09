const searchPostPipeline = require('./searchPostPipeline')
const searchUserPipeline = require(`./searchUserPipeline`)
const userPostsPipeline = require(`./userPostsPipeline`)
const reportedElementPipeline = require(`./reportedElementPipeline`)
const bannedElementPipeline = require(`./bannedElementPipeline`)

module.exports = {
  // the information that the user cannot obtain
  hideUserData: '-password -ban_history -reports -follow_requests -blocked_users -verified_email -roles -banned',
  hidePostData: '-reports -ban_history',
  hideStorieData: {
    views: 0,
    reactions: 0
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