const User = require(`../models/User`)
const cron = require(`node-cron`)

const deleteUsersWithoutConfirmedEmail = async () => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

    await User.deleteMany({
      verified_email: false,
      creation_date: { $lt: twentyFourHoursAgo.toISOString() },
    })
  } catch (error) {
    console.error(error)
    return
  }
}

// Every day at 00:00:00
cron.schedule("0 0 * * *", deleteUsersWithoutConfirmedEmail)
