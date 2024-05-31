const Post = require('../models/Post')
const User = require('../models/User')

const getDataWithPages = async ({ type, pipeline, order, following, page = 1, maxPageSize = 3 }, mainUser) => {
  const skipCount = (page - 1) * maxPageSize
  let newPipeline = [...pipeline]

  let matchCriteria = {}
  if (following === 'following') {
    matchCriteria = type === 'Post' ? { 'user': { $in: mainUser.following } } : { '_id': { $in: mainUser.following } }
  } else if (following === 'friends') {
    matchCriteria = type === 'Post' ? {
      $and: [
        { 'user': { $in: mainUser.following } }, // O mainUser está seguindo ele
        { 'user_info.followers': mainUser._id } // O outro usuário está te seguindo
      ]
    } : {
      $and: [
        { '_id': { $in: mainUser.following } }, // O mainUser está seguindo ele
        { 'followers': mainUser._id } // O outro usuário está te seguindo
      ]
    }
  }

  newPipeline.push({ $match: matchCriteria });

  let sortPipeline;

  switch (order) {
    case 'relevant':
      sortPipeline = { $sort: { isTodayDate: -1, relevance: -1, _id: 1 } }
      break
    case 'most_reports':
      sortPipeline = { $sort: { numReports: -1 , _id: 1} }
      break
    case 'recent_ban':
      sortPipeline = { $sort: { "latestBan.ban_date": 1, _id: 1 } }
      break
    case 'recent':
    default: // default is 'recent'
      sortPipeline = { $sort: { created_at: -1, _id: 1} }
      break
  }

  try {
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
    ];

    const [{ data, totalCount }] = await (
      type === 'Post' ? Post.aggregate(aggregationPipeline) : User.aggregate(aggregationPipeline)
    );

    // Corrigido o cálculo de totalPages
    const totalPages = Math.ceil(totalCount.total / maxPageSize);

    return {
      data,
      page,
      pageSize: data.length,
      maxPageSize,
      totalPages
    };
  } catch (error) {
    throw new Error(error.message);
  }
};


module.exports = getDataWithPages