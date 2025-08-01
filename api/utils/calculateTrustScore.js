const BanHistory = require("../models/BanHistory")
const PostLikes = require("../models/PostLikes")
const Report = require("../models/Report")
const { getAveragePostLikesPipeline } = require("../repositories/index")
const trustScoreData = require("../../constants/index").trustScore

async function calculateTrustScore(user) {
  const { weights, userAge, banHistory, engagement, reports } = trustScoreData

  let finalScore = 0

  // 🧓 User age
  const accountAgeInDays =
    (Date.now() - new Date(user.created_at)) / (1000 * 60 * 60 * 24)
  let userAgeScore = 0
  for (const condition of userAge) {
    if (accountAgeInDays >= condition.ageInDays) {
      userAgeScore = condition.score
      break
    }
  }
  finalScore += userAgeScore * weights.userAge

  // 🔒 Ban History
  const latestBan = await BanHistory.findOne({
    entity_type: "user",
    action_type: "ban",
    entity_id: user._id,
  }).sort({ ban_date: -1 })

  const daysSinceLastBan = latestBan?.ban_date
    ? (Date.now() - new Date(latestBan.ban_date)) / (1000 * 60 * 60 * 24)
    : Infinity

  let banHistoryScore = 0
  for (const condition of banHistory) {
    if (daysSinceLastBan >= condition.daysSinceLastBan) {
      banHistoryScore = condition.score
      break
    }
  }
  finalScore += banHistoryScore * weights.banHistory

  // ❤️ Engagement
  const avgLikesResult = await PostLikes.aggregate(
    getAveragePostLikesPipeline(user._id)
  )
  const averageLikesPerPost = avgLikesResult?.[0]?.averageLikesPerPost || 0

  let engagementScore = 0
  for (const condition of engagement) {
    if (averageLikesPerPost >= condition.averageLikesPerPost) {
      engagementScore = condition.score
      break
    }
  }
  finalScore += engagementScore * weights.engagement

  // 🚨 Reports
  const totalReportsReceived = await Report.countDocuments({
    reportedUserId: user._id,
  })

  let reportsScore = 0
  for (const condition of reports) {
    if (totalReportsReceived <= condition.reportsAmmount) {
      reportsScore = condition.score
      break
    }
  }
  finalScore += reportsScore * weights.reports

  return Math.round(finalScore)
}

module.exports = calculateTrustScore
