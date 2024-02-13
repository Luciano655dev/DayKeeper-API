const deleteImage = require('../common/deleteImage')

const handleMulterError = (err, req, res, next)=>{
    if (err instanceof multer.MulterError) {
        for(let i in req.files)
            deleteImage(req.files[i].key)

        return res.status(400).json({ error: 'Erro no upload de arquivos', message: err.message })
    }

    next()
}

module.exports = handleMulterError