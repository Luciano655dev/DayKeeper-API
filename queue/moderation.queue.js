const { Queue } = require("bullmq")
const IORedis = require("ioredis")

const {
  redis: { url: redisUrl },
} = require("../config")

const connection = new IORedis(redisUrl)

const moderationQueue = new Queue("moderationQueue", { connection })

function enqueueModeration({ mediaId, key, type, uploadedBy }) {
  return moderationQueue.add(
    "analyzeMedia",
    { mediaId, key, type, uploadedBy },
    {
      attempts: 3,
      backoff: { type: "exponential", delay: 3000 },
      removeOnComplete: true,
    }
  )
}

connection.on("ready", () => {
  console.log(`\x1b[36mRedis connected successfully\x1b[0m`)
})

module.exports = { enqueueModeration, moderationQueue }
