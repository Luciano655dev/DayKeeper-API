const searchPostPipeline = require("./pipelines/search/searchPostPipeline")
const searchUserPipeline = require(`./pipelines/search/searchUserPipeline`)
const userPostsPipeline = require(`./pipelines/user/userPostsPipeline`)
const getUserPostsByDayPipeline = require(`./pipelines/user/getUserPostsByDayPipeline`)
const reportedElementPipeline = require(`./pipelines/general/reportedElementPipeline`)

const bannedElementPipeline = require(`./pipelines/admin/bannedElementPipeline`)
const banHistoryMadeByAdmin = require("./pipelines/admin/bansHistoryMadeByAdminPipeline")
const elementBanHistoryPipeline = require("./pipelines/admin/elementBanHistoryPipeline")

const getUserPipeline = require("./pipelines/user/getUserPipeline")
const getUserDayPipeline = require("./pipelines/day/getUserDayPipelines")
const getFollowersPipeline = require("./pipelines/user/getFollowersPipeline")
const getFollowingPipeline = require("./pipelines/user/getFollowingPipeline")
const getFollowRequestsPipeline = require("./pipelines/user/getFollowRequestsPipeline")
const getCloseFriendsPipeline = require("./pipelines/user/getCloseFriendsPipeline")
const getBlockedUsersPipeline = require("./pipelines/user/getBlockedUsersPipeline")

const getPostPipeline = require("./pipelines/post/getPostPipeline")
const getPostLikesPipeline = require("./pipelines/post/getPostLikesPipeline")
const getPostCommentsPipeline = require("./pipelines/post/getPostCommentsPipeline")
const getCommentLikesPipeline = require("./pipelines/post/getCommentLikesPipeline")
const getAveragePostLikesPipeline = require("./pipelines/post/getAveragePostLikesPipeline")

const getStoriePipeline = require("./pipelines/storie/getStoriePipeline")
const getTodayStoriesPipeline = require("./pipelines/storie/getTodayStoriesPipeline")
const getStorieLikesPipeline = require("./pipelines/storie/getStorieLikesPipeline")
const getStorieViewsPipeline = require("./pipelines/storie/getStorieViewsPipeline")
const getUserStoriesFeedPipeline = require("./pipelines/storie/getUserStoriesFeedPipeline")
const userStoriesPipeline = require("./pipelines/storie/userStoriesPipeline")

const searchEventPipeline = require("./pipelines/search/searchEventPipeline")
const searchNotePipeline = require("./pipelines/search/searchNotePipeline")
const searchTaskPipeline = require("./pipelines/search/searchTaskPipeline")
const feedPostPipeline = require("./pipelines/search/feedPostPipeline")

// Hide Projects
const hideUserData = require(`./hideProject/hideUserData`)
const hidePostData = require(`./hideProject/hidePostData`)
const hideStorieData = require("./hideProject/hideStorieData")
const hideGeneralData = require(`./hideProject/hideGeneralData`)

module.exports = {
  // HIDE
  hideUserData,
  hidePostData,
  hideStorieData,
  hideGeneralData,

  // STORIES
  userStoriesPipeline,
  userPostsPipeline,
  reportedElementPipeline,
  feedPostPipeline,

  // SEARCH
  searchPostPipeline,
  searchUserPipeline,
  searchEventPipeline,
  searchNotePipeline,
  searchTaskPipeline,

  // BANS
  bannedElementPipeline,
  banHistoryMadeByAdmin,
  elementBanHistoryPipeline,

  // USER RELATED
  getUserPostsByDayPipeline,
  getUserDayPipeline,
  getUserPipeline,
  getFollowersPipeline,
  getFollowingPipeline,
  getFollowRequestsPipeline,
  getCloseFriendsPipeline,
  getBlockedUsersPipeline,

  // POST RELATED
  getPostPipeline,
  getPostLikesPipeline,
  getPostCommentsPipeline,
  getAveragePostLikesPipeline,
  getCommentLikesPipeline,

  // Stories
  getStoriePipeline,
  getTodayStoriesPipeline,
  getStorieLikesPipeline,
  getStorieViewsPipeline,
  getUserStoriesFeedPipeline,
}
