const mongoose = require("mongoose")
const User = require("./api/models/User")
const getUserPipeline = require("./api/repositories/pipelines/user/getUserPipeline")

const DBuser = process.env.DB_USER
const DBpass = process.env.DB_PASS
const DBclusterName = process.env.DB_CLUSTER_NAME

async function run() {
  await mongoose.connect(
    `mongodb+srv://${DBuser}:${DBpass}@${DBclusterName}.iyslifi.mongodb.net/?retryWrites=true&w=majority`
  )

  const userInput = "Luciano"
  const loggedUser = {
    _id: new mongoose.Types.ObjectId("69546063b0bf73e40f2c5780"),
    timeZone: "America/New_York",
  }

  const pipeline = getUserPipeline(userInput, loggedUser)

  // ✅ MongoDB command-level explain for aggregate
  const explanation = await mongoose.connection.db.command({
    explain: {
      aggregate: User.collection.collectionName, // usually "users"
      pipeline,
      cursor: {},
    },
    verbosity: "executionStats",
  })

  console.dir(explanation, { depth: null })

  await mongoose.disconnect()
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
