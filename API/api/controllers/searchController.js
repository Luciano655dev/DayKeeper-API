const search = require('../services/seach/search')
const { errors: { serverError } } = require('../../constants/index')

const searchController = async (req, res) => {
    try {
        const { code, response } = await search({
            ...req.query,
            id: req.id
        })

        return res.status(code).json(response)
    } catch (error) {
        return res.status(500).json({ message: serverError(`${error}`) })
    }
}

module.exports = {
    search: searchController
}
