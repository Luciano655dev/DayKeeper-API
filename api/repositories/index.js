const searchPostPipeline = require("./pipelines/search/searchPostPipeline")
const searchUserPipeline = require(`./pipelines/search/searchUserPipeline`)
const userPostsPipeline = require(`./pipelines/user/userPostsPipeline`)
const userStoriesPipeline = require("./pipelines/user/userStoriesPipeline")
const reportedElementPipeline = require(`./pipelines/general/reportedElementPipeline`)

const bannedElementPipeline = require(`./pipelines/admin/bannedElementPipeline`)
const banHistoryMadeByAdmin = require("./pipelines/admin/bansHistoryMadeByAdminPipeline")
const elementBanHistoryPipeline = require("./pipelines/admin/elementBanHistoryPipeline")

const getFollowersPipeline = require("./pipelines/user/getFollowersPipeline")
const getFollowingPipeline = require("./pipelines/user/getFollowingPipeline")
const getFollowRequestsPipeline = require("./pipelines/user/getFollowRequestsPipeline")
const getBlockedUsersPipeline = require("./pipelines/user/getBlockedUsersPipeline")

const getPostLikesPipeline = require("./pipelines/post/getPostLikesPipeline")
const getPostCommentsPipeline = require("./pipelines/post/getPostCommentsPipeline")
const getCommentLikesPipeline = require("./pipelines/post/getCommentLikesPipeline")

const getStorieLikesPipeline = require("./pipelines/storie/getStorieLikesPipeline")
const getStorieViewsPipeline = require("./pipelines/storie/getStorieViewsPipeline")

const searchEventPipeline = require("./pipelines/search/searchEventPipeline")
const searchNotePipeline = require("./pipelines/search/searchNotePipeline")

// Hide Projects
const hideUserData = require(`./hideProject/hideUserData`)
const hidePostData = require(`./hideProject/hidePostData`)
const hideStorieData = require("./hideProject/hideStorieData")
const hideGeneralData = require(`./hideProject/hideGeneralData`)

module.exports = {
  hideUserData,
  hidePostData,
  hideStorieData,
  hideGeneralData,

  userStoriesPipeline,
  searchPostPipeline,
  searchUserPipeline,
  userPostsPipeline,
  reportedElementPipeline,

  searchEventPipeline,
  searchNotePipeline,

  bannedElementPipeline,
  banHistoryMadeByAdmin,
  elementBanHistoryPipeline,

  getFollowersPipeline,
  getFollowingPipeline,
  getFollowRequestsPipeline,
  getBlockedUsersPipeline,
  getPostLikesPipeline,
  getPostCommentsPipeline,
  getCommentLikesPipeline,
  getStorieLikesPipeline,
  getStorieViewsPipeline,
}
