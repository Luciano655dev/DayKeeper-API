const detectInappropriateContent = require(`../api/utils/detectInappropriateFile`)
const deleteFile = require(`../api/utils/deleteFile`)

async function detectInappropriateContentMW(req, res, next){
    const files = req?.file ? [req.file] : req.files

    try{
        for(let file of files){
            const isAppropriate = await detectInappropriateContent(file.key, file.mimetype.split(`/`)[0])

            if(!isAppropriate){
                deleteFile(file.key)
                return res.status(409).json({ message: `Esta imagem viola os termos de servico do DayKeeper` })
            }
        }

        next()
    }catch(error){
        for(let file of files)
            deleteFile(file.key)

        console.log(`error no mw: ${error}`)
        return res.status(400).json({ error })
    }

}

module.exports = detectInappropriateContentMW