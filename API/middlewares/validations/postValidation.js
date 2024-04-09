const Post = require('../../models/Post')
const bf = require('better-format')
const deleteFile = require('../../common/deleteFile')

const postValidation = async(req, res, next)=>{
    const { data } = req.body
    const loggedUserId = req.id

    try{
        // Input Validations
        if( data.length <= 0 || data.length > 5000 ){
            // deleta as imagens mandadas anteriormente
            for(let i in req.files)
                deleteFile(req.files[i].key)

            return res.status(400).json({ msg: "O texto está muito longo" })
        }

        // One post per day
        let lastPost = await Post.find({ user: loggedUserId }).sort({ created_at: -1 })
        const titleDate = bf.FormatDate(Date.now())
        const title = `${titleDate.day}-${titleDate.month}-${titleDate.year}`

        if(lastPost[0]){
            if(lastPost[0].title == title){
                // deleta as imagens mandadas anteriormente
                for(let i in req.files)
                    deleteFile(req.files[i].key)
                
                return res.status(400).json({ msg: "Você só pode fazer um Post por dia" })
            }
        }

        return next()
    }catch(error){
        // deleta as imagens mandadas anteriormente
        if(req.files)
            for(let i in req.files)
                deleteFile(req.files[i].key)

        return res.status(500).json({ msg: `${error}` })
    }
}

module.exports = postValidation