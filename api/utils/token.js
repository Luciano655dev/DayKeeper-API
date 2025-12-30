const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const RefreshToken = require("../models/RefreshToken")

const ACCESS_TTL_SECONDS = 60 * 15 // 15 minutes
const REFRESH_TTL_DAYS = 30

function signAccessToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      roles: user.roles || ["user"],
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: ACCESS_TTL_SECONDS,
      issuer: "daykeeper",
    }
  )
}

function makeRefreshToken() {
  return crypto.randomBytes(64).toString("hex")
}

function hashRefreshToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex")
}

async function storeRefreshToken({
  userId,
  refreshToken,
  deviceId,
  ip,
  userAgent,
}) {
  const tokenHash = hashRefreshToken(refreshToken)
  const expiresAt = new Date(
    Date.now() + REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000
  )

  await RefreshToken.create({
    user: userId,
    tokenHash,
    expiresAt,
    deviceId: deviceId || null,
    ip: ip || null,
    userAgent: userAgent || null,
  })
}

async function rotateRefreshToken(oldRaw, meta) {
  const oldHash = hashRefreshToken(oldRaw)
  const oldDoc = await RefreshToken.findOne({ tokenHash: oldHash })

  if (!oldDoc) return null
  if (oldDoc.revokedAt) return null
  if (oldDoc.expiresAt.getTime() < Date.now()) return null

  const newRaw = makeRefreshToken()
  const newHash = hashRefreshToken(newRaw)

  oldDoc.revokedAt = new Date()
  oldDoc.replacedByTokenHash = newHash
  await oldDoc.save()

  await RefreshToken.create({
    user: oldDoc.user,
    tokenHash: newHash,
    expiresAt: new Date(Date.now() + REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000),
    deviceId: meta?.deviceId || oldDoc.deviceId || null,
    ip: meta?.ip || null,
    userAgent: meta?.userAgent || null,
  })

  return { userId: oldDoc.user.toString(), newRefreshToken: newRaw }
}

async function revokeRefreshToken(raw) {
  const tokenHash = hashRefreshToken(raw)
  await RefreshToken.updateOne(
    { tokenHash, revokedAt: null },
    { $set: { revokedAt: new Date() } }
  )
}

module.exports = {
  ACCESS_TTL_SECONDS,
  signAccessToken,
  makeRefreshToken,
  storeRefreshToken,
  rotateRefreshToken,
  revokeRefreshToken,
}
