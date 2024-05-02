const deleteImage = require('../common/deleteFile')
const multer = require('multer')

const handleMulterError = (err, req, res, next)=>{
    if (err instanceof multer.MulterError) {
        for(let i in req.files)
            deleteImage(req.files[i].key)

        console.log('erro no upload dos arquivos')
        return res.status(400).json({ error: "Error uploading files", message: err.message })
    }

    return next()
}

module.exports = handleMulterError