const Post = require('../../../api/models/Post')
const deleteFile = require('../../../api/utils/deleteFile')
const { serverError, inputTooLong, fieldsNotFilledIn } = require('../../../constants')

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
            return handleBadRequest(400, fieldsNotFilledIn)
    
        if (data.length > maxDataLength)
        return handleBadRequest(413, inputTooLong('Text'))

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
        return handleBadRequest(500, serverError(error.message))
    }
}

module.exports = postValidation