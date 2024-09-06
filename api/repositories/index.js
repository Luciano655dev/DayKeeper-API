const searchPostPipeline = require("./pipelines/search/searchPostPipeline")
const searchUserPipeline = require(`./pipelines/search/searchUserPipeline`)
const userPostsPipeline = require(`./pipelines/user/userPostsPipeline`)
const reportedElementPipeline = require(`./pipelines/general/reportedElementPipeline`)
const bannedElementPipeline = require(`./pipelines/admin/bannedElementPipeline`)

const getFollowersPipeline = require("./pipelines/user/getFollowersPipeline")
const getFollowingPipeline = require("./pipelines/user/getFollowingPipeline")
const getFollowRequestsPipeline = require("./pipelines/user/getFollowRequestsPipeline")
const getBlockedUsersPipeline = require("./pipelines/user/getBlockedUsersPipeline")

const getPostLikesPipeline = require("./pipelines/post/getPostLikesPipeline")
const getPostCommentsPipeline = require("./pipelines/post/getPostCommentsPipeline")
const getCommentLikesPipeline = require("./pipelines/post/getCommentLikesPipeline")

// Hide Projects
const hideUserData = require(`./hideProject/hideUserData`)
const hidePostData = require(`./hideProject/hidePostData`)
const hideStorieData = require("./hideProject/hideStorieData")
const hideGeneralData = require(`./hideProject/hideGeneralData`)

// Admin Pipelines

module.exports = {
  hideUserData,
  hidePostData,
  hideStorieData,
  hideGeneralData,

  searchPostPipeline,
  searchUserPipeline,
  userPostsPipeline,
  reportedElementPipeline,
  bannedElementPipeline,
  getFollowersPipeline,
  getFollowingPipeline,
  getFollowRequestsPipeline,
  getBlockedUsersPipeline,
  getPostLikesPipeline,
  getPostCommentsPipeline,
  getCommentLikesPipeline,
}
