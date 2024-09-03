const reportedElementPipeline = [
    {
      $match: {
        $and: [
          { 
            'banned': "false"
          },
          {
            reports: {
              $exists: true,
              $not: { $size: 0 }
            }
          }
        ]
      },
    },
    {
      $addFields: {
        numReports: { $size: "$reports" }
      },
    }
]

module.exports = reportedElementPipeline