const User = require("../../../models/User")
const getDailyTasksPipeline = require("../../../repositories/pipelines/day/tasks/getDailyTasksPipeline")
const getDataWithPages = require("../../getDataWithPages")

const {
  errors: { notFound, unauthorized },
  success: { fetched },
} = require("../../../../constants/index")

const getDailyTasks = async (props) => {
  const { loggedUser, name, page, maxPageSize } = props || {}

  try {
    let targetUser = loggedUser

    // Just you can see your daily tasks
    if (name) {
      targetUser = await User.findOne({ name })
      if (!targetUser) return notFound("User")
    }

    const tasks = await getDataWithPages(
      {
        type: "Task",
        pipeline: getDailyTasksPipeline(targetUser, loggedUser),
        page,
        maxPageSize,
      },
      loggedUser
    )

    return fetched("Daily Tasks", { data: tasks || [] })
  } catch (error) {
    throw error
  }
}

module.exports = getDailyTasks
