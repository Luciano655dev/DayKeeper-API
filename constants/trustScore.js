const trustScore = {
  trustSkipThreshold: 80,
  skipPercentage: 0.5, // 50%
  weights: {
    userAge: 0.25,
    banHistory: 0.25,
    engagement: 0.25,
    reports: 0.25,
  },

  userAge: [
    { ageInDays: 365, score: 100 },
    { ageInDays: 180, score: 75 },
    { ageInDays: 90, score: 50 },
    { ageInDays: 30, score: 25 },
  ],

  banHistory: [
    { daysSinceLastBan: 365, score: 100 },
    { daysSinceLastBan: 180, score: 75 },
    { daysSinceLastBan: 90, score: 50 },
    { daysSinceLastBan: 30, score: 25 },
    { daysSinceLastBan: 0, score: 0 },
  ],

  engagement: [
    { averageLikesPerPost: 50, score: 100 },
    { averageLikesPerPost: 25, score: 75 },
    { averageLikesPerPost: 10, score: 50 },
    { averageLikesPerPost: 5, score: 25 },
    { averageLikesPerPost: 0, score: 0 },
  ],

  reports: [
    { reportsAmmount: 0, score: 100 },
    { reportsAmmount: 5, score: 75 },
    { reportsAmmount: 15, score: 50 },
    { reportsAmmount: 30, score: 25 },
    { reportsAmmount: 50, score: 0 },
  ],
}

module.exports = trustScore
