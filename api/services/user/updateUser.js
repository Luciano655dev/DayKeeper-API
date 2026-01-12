const User = require("../../models/User")
const Followers = require("../../models/Followers")
const bcrypt = require("bcryptjs")
const crypto = require("crypto")
const deleteFile = require("../../utils/deleteFile")
const { sendVerificationEmail } = require("../../utils/emailHandler")

const {
  errors: { notFound },
  success: { updated },
  auth: { registerCodeExpiresTime },
  user: { defaultPfp },
} = require("../../../constants/index")

function make6DigitCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function hashCode(code) {
  return crypto.createHash("sha256").update(code).digest("hex")
}

const updateUser = async (params) => {
  let { username, email, password, bio, file, loggedUser } = params

  username = typeof username === "string" ? username.trim() : undefined
  email = typeof email === "string" ? email.trim().toLowerCase() : undefined
  bio = typeof bio === "string" ? bio : undefined

  const privateNext =
    typeof params?.private === "string" &&
    (params.private === "true" || params.private === "false")
      ? params.private === "true"
      : !!loggedUser.private

  // Load fresh from DB (don’t trust token snapshot)
  let user = loggedUser
  if (!user?.save) user = await User.findById(loggedUser._id)

  const emailChanged = !!email && email !== user.email
  const nameChanged = !!username && username !== user.username

  // Keep old picture key so we can delete it AFTER successful update
  const oldPictureKey = user.profile_picture?.key
  const oldPictureTitle = user.profile_picture?.title

  // Hash password if provided
  let passwordHash
  if (typeof password === "string" && password.length > 0) {
    passwordHash = await bcrypt.hash(password, 12)
  }

  // private -> public cleanup
  if (user.private === true && privateNext === false) {
    await Followers.deleteMany({
      following: user._id,
      required: true,
    })
  }

  // If email changed, rotate verification
  let verificationCode
  let verificationCodeHash
  let verificationExpiresAt

  if (emailChanged) {
    verificationCode = make6DigitCode()
    verificationCodeHash = hashCode(verificationCode)
    verificationExpiresAt = new Date(Date.now() + registerCodeExpiresTime)
  }

  const set = {
    username: username || user.username,
    bio: bio ?? user.bio ?? "",
    private: privateNext,
  }

  if (nameChanged) set.username = username
  if (passwordHash) set.password = passwordHash

  if (file) {
    set.profile_picture = {
      title: file.originalname,
      key: file.key,
      url: file.url,
    }
  }

  if (emailChanged) {
    set.email = email
    set.verified_email = false
    set.verification_code_hash = verificationCodeHash
    set.verification_expires_at = verificationExpiresAt
  }

  let updatedUser
  try {
    updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $set: set },
      { new: true }
    )
  } catch (err) {
    if (err && (err.code === 11000 || err.code === 11001)) {
      const dupField = Object.keys(err.keyPattern || {})[0]
      if (dupField === "email") throw new Error("Email already in use")
      if (dupField === "username") throw new Error("Username already in use")
      throw new Error("Duplicate value")
    }
    throw err
  }

  if (!updatedUser) return notFound("User")

  // delete old pfp ONLY after update succeeded
  if (
    file &&
    oldPictureKey &&
    oldPictureTitle &&
    defaultPfp?.title &&
    oldPictureTitle !== defaultPfp.title &&
    oldPictureKey !== file.key
  ) {
    deleteFile({ key: oldPictureKey }).catch?.(() => null)
  }

  // Best-effort email verification send
  if (emailChanged) {
    const pfpUrl = updatedUser.profile_picture?.url || defaultPfp?.url
    sendVerificationEmail(
      updatedUser.username,
      updatedUser.email,
      pfpUrl,
      verificationCode
    ).catch(() => null)
  }

  return updated("user", { user: updatedUser })
}

module.exports = updateUser
