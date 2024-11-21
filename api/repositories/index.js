const searchPostPipeline = require("./pipelines/search/searchPostPipeline")
const searchUserPipeline = require(`./pipelines/search/searchUserPipeline`)
const userPostsPipeline = require(`./pipelines/user/userPostsPipeline`)
const reportedElementPipeline = require(`./pipelines/general/reportedElementPipeline`)

const bannedElementPipeline = require(`./pipelines/admin/bannedElementPipeline`)
const banHistoryMadeByAdmin = require("./pipelines/admin/bansHistoryMadeByAdminPipeline")
const elementBanHistoryPipeline = require("./pipelines/admin/elementBanHistoryPipeline")

const getUserPipeline = require("./pipelines/user/getUserPipeline")
const getFollowersPipeline = require("./pipelines/user/getFollowersPipeline")
const getFollowingPipeline = require("./pipelines/user/getFollowingPipeline")
const getFollowRequestsPipeline = require("./pipelines/user/getFollowRequestsPipeline")
const getCloseFriendsPipeline = require("./pipelines/user/getCloseFriendsPipeline")
const getBlockedUsersPipeline = require("./pipelines/user/getBlockedUsersPipeline")

const getPostPipeline = require("./pipelines/post/getPostPipeline")
const getPostLikesPipeline = require("./pipelines/post/getPostLikesPipeline")
const getPostCommentsPipeline = require("./pipelines/post/getPostCommentsPipeline")
const getCommentLikesPipeline = require("./pipelines/post/getCommentLikesPipeline")

const getStoriePipeline = require("./pipelines/storie/getStoriePipeline")
const getStorieLikesPipeline = require("./pipelines/storie/getStorieLikesPipeline")
const getStorieViewsPipeline = require("./pipelines/storie/getStorieViewsPipeline")
const userStoriesPipeline = require("./pipelines/storie/userStoriesPipeline")

const searchEventPipeline = require("./pipelines/search/searchEventPipeline")
const searchNotePipeline = require("./pipelines/search/searchNotePipeline")
const searchTaskPipeline = require("./pipelines/search/searchTaskPipeline")

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
  searchTaskPipeline,

  bannedElementPipeline,
  banHistoryMadeByAdmin,
  elementBanHistoryPipeline,

  getUserPipeline,
  getFollowersPipeline,
  getFollowingPipeline,
  getFollowRequestsPipeline,
  getCloseFriendsPipeline,
  getBlockedUsersPipeline,
  getPostPipeline,
  getPostLikesPipeline,
  getPostCommentsPipeline,
  getCommentLikesPipeline,
  getStoriePipeline,
  getStorieLikesPipeline,
  getStorieViewsPipeline,
}
