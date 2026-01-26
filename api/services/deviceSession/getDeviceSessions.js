const RefreshToken = require("../../models/RefreshToken")
const {
  errors: { unauthorized },
  success: { fetched },
  maxPageSize: DEFAULT_MAX_PAGE_SIZE,
} = require("../../../constants/index")

const getDeviceSessions = async (props) => {
  const { loggedUser, page, maxPageSize } = props

  if (!loggedUser?._id) return unauthorized("fetch sessions")

  let p = Number(page)
  let size = Number(maxPageSize)

  if (!Number.isFinite(p) || p < 1) p = 1
  if (!Number.isFinite(size) || size < 1) size = DEFAULT_MAX_PAGE_SIZE
  size = Math.min(size, DEFAULT_MAX_PAGE_SIZE)

  const skipCount = (p - 1) * size
  const query = {
    user: loggedUser._id,
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  }

  const totalCount = await RefreshToken.countDocuments(query)
  const rows = await RefreshToken.find(query)
    .sort({ createdAt: -1 })
    .skip(skipCount)
    .limit(size)
    .select("deviceId ip userAgent createdAt expiresAt revokedAt")
    .lean()

  const now = Date.now()
  const data = rows.map((row) => {
    const expiresAt = row.expiresAt ? new Date(row.expiresAt).getTime() : null
    const revokedAt = row.revokedAt ? new Date(row.revokedAt).getTime() : null
    let status = "active"

    if (revokedAt) status = "revoked"
    else if (expiresAt && expiresAt < now) status = "expired"

    const { _id, ...rest } = row

    return {
      ...rest,
      id: _id,
      status,
    }
  })

  const totalPages = totalCount ? Math.ceil(totalCount / size) : 0

  return fetched("sessions", {
    response: {
      data,
      page: p,
      pageSize: data.length,
      maxPageSize: size,
      totalPages,
      totalCount,
    },
  })
}

module.exports = getDeviceSessions
