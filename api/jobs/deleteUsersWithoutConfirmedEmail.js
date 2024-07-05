const User = require(`../models/User`)
const cron = require(`node-cron`)

const deleteUsersWithoutConfirmedEmail = async()=>{
    try{
        await User.deleteMany({ verified_email: false })
    }catch(error){
        console.log(error)
        return
    }
}

// Every day at 00:00:00
cron.schedule('0 0 * * *', deleteUsersWithoutConfirmedEmail)