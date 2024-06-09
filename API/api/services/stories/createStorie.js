const Storie = require(`../../models/Storie`)
const getTodayDate = require(`../../utils/getTodayDate`)

const {
    stories: { maxStoriesPerDay },
    errors: { maxQuantityToday },
    success: { created }
} = require('../../../constants')

const createStorie = async(props)=>{
    const {
        text,
        file,
        loggedUserId
    } = props

    try{
        const todayDate = getTodayDate()
        const todayStoriesCount = await Storie.countDocuments({ title: todayDate })

        if(todayStoriesCount >= maxStoriesPerDay)
            return maxQuantityToday(`Stories`)

        const newStorie = new Storie({
            title: `${todayDate}`,
            file,
            text,
            user: loggedUserId,
            created_at: new Date(),
            views: [],
            reactions: [],
            reports: []
        })

        await newStorie.save()

        return created("Storie", { storie: newStorie })
    }catch(error){
        throw new Error(error.message)
    }
}

module.exports = createStorie