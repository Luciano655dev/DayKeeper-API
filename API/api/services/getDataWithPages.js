const Post = require('../models/Post')
const User = require('../models/User')

const getDataWithPages = async({ type, pipeline, order, page = 1, maxPageSize = 3 })=>{
    const skipCount = (page - 1) * maxPageSize
    let newPipeline = pipeline

    let sortPipeline = { $sort: { created_at: -1 } } // recent
    if (order === 'relevant')
      sortPipeline = { $sort: { isTodayDate: -1, relevance: -1 } } // relevant
    
    try{
      let totalPages = 0
      if(type == 'Post'){
        const totalPostsAggregationResult = await Post.aggregate([...newPipeline, { $count: "total" }])
        const totalPosts = (totalPostsAggregationResult.length > 0) ? totalPostsAggregationResult[0].total : 0
        totalPages = Math.ceil(totalPosts / maxPageSize)
      } else {
        const totalUsersAggregationResult = await User.aggregate([...newPipeline, { $count: "total" }])
        const totalUsers = (totalUsersAggregationResult.length > 0) ? totalUsersAggregationResult[0].total : 0
        totalPages = Math.ceil(totalUsers / maxPageSize)
      }
  
      newPipeline.push(
        sortPipeline,
        { $skip: skipCount },
        { $limit: maxPageSize }
      )

      let data
      if(type == 'Post'){
        data = await Post.aggregate(newPipeline)
      } else {
        data = await User.aggregate(newPipeline)
      }
  
      return {
        data,
        page,
        pageSize: data.length,
        maxPageSize,
        totalPages
      }
    }catch(error){
      throw new Error(error.message)
    }
}

module.exports = getDataWithPages