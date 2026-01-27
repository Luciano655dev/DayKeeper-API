const DEFAULT_WINDOW_MS = 15 * 60 * 1000
const DEFAULT_MAX = 300

const buckets = new Map()

const cleanupBuckets = () => {
  const now = Date.now()
  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) buckets.delete(key)
  }
}

setInterval(cleanupBuckets, DEFAULT_WINDOW_MS).unref()

const rateLimit = ({
  windowMs = DEFAULT_WINDOW_MS,
  max = DEFAULT_MAX,
  keyGenerator,
  methods,
} = {}) => {
  return (req, res, next) => {
    if (Array.isArray(methods) && methods.length) {
      const method = String(req.method || "").toUpperCase()
      if (!methods.includes(method)) return next()
    }

    const key =
      (keyGenerator && keyGenerator(req)) || `${req.ip}:${req.baseUrl || ""}`
    const now = Date.now()

    let bucket = buckets.get(key)
    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 1, resetAt: now + windowMs }
      buckets.set(key, bucket)
    } else {
      bucket.count += 1
    }

    if (bucket.count > max) {
      const retryAfter = Math.ceil((bucket.resetAt - now) / 1000)
      res.setHeader("Retry-After", String(retryAfter))
      return res.status(429).json({
        message: "Too many requests, please try again later.",
      })
    }

    return next()
  }
}

module.exports = rateLimit
