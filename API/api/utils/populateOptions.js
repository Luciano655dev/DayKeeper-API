const { hideUserData } = require(`../repositories/index`)

const populateOptions = (fieldsToPopulate, match, select)=> {
    // default options is for users
    match = match ? match : { banned: { $ne: true } }
    select = select ? select : hideUserData

    return fieldsToPopulate.map(path => ({
        path,
        match,
        select,
    }))
}

module.exports = populateOptions