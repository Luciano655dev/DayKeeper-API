const confirmEmailValidation = async(req, res, next)=>{
    const { token } = req.query

    if(!token)
        return res.status(422).json({ msg: "The token needs to be filled in" })

    return next()
}

module.exports = confirmEmailValidation