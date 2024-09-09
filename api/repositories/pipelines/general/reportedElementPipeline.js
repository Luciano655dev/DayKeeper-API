const reportedElementPipeline = (type = "") => [
  {
    $match: {
      $and: [
        {
          banned: "false",
        },
        {
          type,
        },
      ],
    },
  },
]

module.exports = reportedElementPipeline
