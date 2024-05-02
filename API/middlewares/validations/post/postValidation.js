const Post = require('../../../models/Post')
const bf = require('better-format')
const deleteFile = require('../../../common/deleteFile')

const postValidation = async(req, res, next)=>{
    const { data } = req.body
    const loggedUserId = req.id
    const maxDataLength = 1000

    try{
        function handleBadRequest(errorCode, message){
            /* Delete previous files */
            if (files) {
              for(let i in req.files){
                deleteFile(req.files[i].key)
              }
            }
          
            return res.status(errorCode).json({ message })
        }

        /* Input Validations */
        if (!data)
            return handleBadRequest(400, "The text needs to be filled in")
    
        if (data.length > maxDataLength)
        return handleBadRequest(413, "The text is too long")

        /* One post per day */
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const lastPostToday = await Post.findOne({ 
            user: loggedUserId, 
            created_at: { $gte: today }
        })

        if (lastPostToday)
        return handleBadRequest(400, "You can only make one post per day")

        return next()
    } catch(error){
        return handleBadRequest(500,
            `Server error. If possible, contact an administrator and provide the necessary information... Error: "${error.message}"`
        )
    }
}

module.exports = postValidation