const searchPostPipeline = require("./searchPostPipeline")
const searchUserPipeline = require(`./searchUserPipeline`)
const userPostsPipeline = require(`./userPostsPipeline`)
const reportedElementPipeline = require(`./reportedElementPipeline`)
const bannedElementPipeline = require(`./bannedElementPipeline`)

const getFollowersPipeline = require("./getFollowersPipeline")
const getFollowingPipeline = require("./getFollowingPipeline")
const getFollowRequestsPipeline = require("./getFollowRequestsPipeline")
const getBlockedUsersPipeline = require("./getBlockedUsersPipeline")

module.exports = {
  hideUserData: {
    password: false,
    ban_history: false,
    reports: false,
    follow_requests: false,
    verified_email: false,
    roles: false,
    banned: false,
    device_tokens: false,
  },
  hidePostData: {
    reports: false,
    ban_history: false,
  },
  hideStorieData: {
    views: 0,
    likes: 0,
  },
  hideGeneralData: {
    banned: 0,
    ban_history: 0,
    reports: 0,
  },
  searchPostPipeline,
  searchUserPipeline,
  userPostsPipeline,
  reportedElementPipeline,
  bannedElementPipeline,
  getFollowersPipeline,
  getFollowingPipeline,
  getFollowRequestsPipeline,
  getBlockedUsersPipeline,
}
