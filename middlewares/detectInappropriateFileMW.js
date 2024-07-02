const detectInappropriateContent = require(`../api/utils/detectInappropriateFile`)
const deleteFile = require(`../api/utils/deleteFile`)

const {
    errors: { serverError }
} = require('../constants/index')

async function detectInappropriateContentMW(req, res, next){
    const files = req?.file ? [req.file] : req.files

    try{
        for(let file of files){
            const isAppropriate = await detectInappropriateContent(file.key, file.mimetype.split(`/`)[0])

            if(!isAppropriate){
                deleteFile(file.key)
                return res.status(409).json({ message: `This image violates DayKeeper's terms of service` })
            }
        }

        next()
    }catch(error){
        for(let file of files)
            deleteFile(file.key)

        console.log(`error at detectInapropriateFileMW: ${error}`)
        return res.status(500).json({ message: serverError(error.message).message })
    }

}

module.exports = detectInappropriateContentMW