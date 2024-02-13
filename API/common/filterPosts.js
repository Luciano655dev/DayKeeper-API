const User = require('../models/User')
const bf = require('better-format')

async function filterDay(posts, day){
    return posts.filter( post => bf.FormatDate(post.created_at).day == day) // get Today posts
}

async function filterPosts(posts, day, loggedUserId){
    const mainUser = await User.findById(loggedUserId)

    return posts
        .filter( async(post) => {
            const postUser = await User.findById(post.user)

            if(
                !postUser.blocked_users.includes(mainUser._id) && // se o cara não te bloqueou
                !mainUser.blocked_users.includes(postUser._id) // se você não bloqueou o cara
            ) return post
        })
        .filter( async(post) => {
            const postUser = await User.findById(post.user)

            if(!postUser.private || postUser._id == mainUser._id) return post // caso não seja privado ou seja seu post
            if(postUser.followers.includes(mainUser._id)) return post // caso seja privado e estiver seguindo
        } )
}

async function filterFollowing(posts, loggedUserId){
    let usersFollowing = await User.find({ followers: loggedUserId })

    // pega apenas o ID e transforma-o em String
    usersFollowing = usersFollowing.map( user => String(user._id))

    return posts.filter( post => usersFollowing.includes(post.user) )
}

module.exports = {
    filterPosts,
    filterFollowing,
    filterDay
}