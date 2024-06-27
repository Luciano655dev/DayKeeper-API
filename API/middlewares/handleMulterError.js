const deleteImage = require('../api/utils/deleteFile')
const multer = require('multer')

const handleMulterError = (err, req, res, next)=>{
    console.log('erro no upload dos arquivos MULTER')
    if (err instanceof multer.MulterError) {
        if(req?.files)
            for(let i in req.files)
                deleteImage(req.files[i].key)
        else if(req?.file)
            deleteImage(req.file.key)

        return res.status(400).json({ error: "Error uploading files", message: err.message })
    }

    return next()
}

module.exports = handleMulterError