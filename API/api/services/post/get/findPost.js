const User = require('../../../models/User')
const Post = require('../../../models/Post')
const { hideUserData, hidePostData } = require('../../../repositories')

async function findPost(userInput, posttitle, type = 'username', fieldsToPopulate = []) {
  try {
    let post = {}

    const populateOptions = fieldsToPopulate.map(field => ({
      path: field,
      match: { banned: { $ne: true } },
      select: hideUserData
    }))

    const query = { title: posttitle }
    if (type === 'username') {
      const user = await User.findOne({ name: userInput })
      if (!user) return null
      query.user = user._id
    } else {
      query.user = userInput
    }

    post = await Post.findOne(query)
      .select(hidePostData)
      .populate(populateOptions)

    return post
  } catch (err) {
    return null
  }
}

module.exports = findPost