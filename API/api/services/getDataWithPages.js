const Post = require('../models/Post')
const User = require('../models/User')
const Storie = require(`../models/Storie`)

const getDataWithPages = async ({ type, pipeline, order, following, page, maxPageSize }, mainUser) => {
  page = Number(page)
  maxPageSize = Number(maxPageSize)

  if(isNaN(page)) page = 1
  if(isNaN(maxPageSize)) maxPageSize = 5

  const skipCount = (page - 1) * maxPageSize
  let newPipeline = [...pipeline]

  // ========== FOLLOWING ==========
  let canApplyFollowing = ( type == `Post` || type == `User` )
  let matchCriteria = {}
  if (following === 'following' && canApplyFollowing) {
    matchCriteria = type === 'Post'
      ? { 'user': { $in: mainUser.following } }
      : { '_id': { $in: mainUser.following } };
  } else if (following === 'friends' && canApplyFollowing) {
    matchCriteria = type === 'Post'? 
      {
        $and: [
          { 'user': { $in: mainUser.following } },
          { 'user_info.followers': mainUser._id }
        ]
      }
      :
      {
        $and: [
          { '_id': { $in: mainUser.following } },
          { 'followers': mainUser._id }
        ]
      }
  }

  newPipeline.push({ $match: matchCriteria })

  // ========== SORT ===========
  const timeZoneCreation = {
    $addFields: {
      timeZoneMatch: {
        $cond: [
          { $eq: [{ $arrayElemAt: [{ $split: [
            ( type == `Post` || type == `User` ) ? "$user_info.timeZone" : "timeZone", "/"
          ] }, 0] }, mainUser.timeZone.split('/')[0]] },
          1,
          0
        ]
      }
    }
  }
  let sortPipeline
  switch (order) {
    case 'relevant':
      sortPipeline = { $sort: { created_at: -1, relevance: -1, timeZoneMatch: -1, _id: 1 } }
      break
    case 'most_reports':
      sortPipeline = { $sort: { numReports: -1, timeZoneMatch: -1, _id: 1} }
      break
    case 'recent_ban':
      sortPipeline = { $sort: { "latestBan.ban_date": 1, _id: 1 } }
      break
    case 'recent':
    default: // default is 'recent'
      sortPipeline = { $sort: { created_at: -1, timeZoneMatch: -1, _id: 1} }
      break
  }

  try {
    // ========== AGGREGATION ==========
    const aggregationPipeline = [
      { $facet: {
          data: [
            ...newPipeline,
            sortPipeline,
            { $skip: skipCount },
            { $limit: maxPageSize }
          ],
          totalCount: [
            ...newPipeline,
            { $count: "total" }
          ]
        }
      },
      { $unwind: "$totalCount" }
    ]

    const Model = type === 'Post' ? Post : (type === 'Storie' ? Storie : User)
    const [{ data, totalCount }] = await Model.aggregate(aggregationPipeline)

    // Corrigido o cálculo de totalPages
    const totalPages = Math.ceil(totalCount.total / maxPageSize)

    return {
      data,
      page,
      pageSize: data.length,
      maxPageSize,
      totalPages
    }
  } catch (error) {
    throw new Error(error.message)
  }
}


module.exports = getDataWithPages