const fs = require("fs")
const path = require("path")
const { spawn } = require("child_process")

function generateVideoThumbnails(videoPath, outputDir, count = 10) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

    const jobDir = fs.mkdtempSync(path.join(outputDir, "job-"))
    const ext = "png"
    const outPattern = path.join(jobDir, `thumb-%03d.${ext}`)

    const args = [
      "-hide_banner",
      "-loglevel",
      "error",
      "-i",
      videoPath,
      "-vf",
      `fps=1,scale=trunc(iw/2)*2:trunc(ih/2)*2`,
      "-frames:v",
      String(count),
      outPattern,
    ]

    const child = spawn("ffmpeg", args, { stdio: ["ignore", "pipe", "pipe"] })

    let stderr = ""
    child.stderr.on("data", (d) => (stderr += d.toString()))

    child.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(`ffmpeg exited with ${code}: ${stderr}`))
      }

      const files = fs
        .readdirSync(jobDir)
        .filter((f) => f.startsWith("thumb-") && f.endsWith(`.${ext}`))
        .map((f) => path.join(jobDir, f))
        .sort()

      if (files.length === 0) {
        return reject(new Error("Nenhum thumbnail foi gerado pelo ffmpeg."))
      }
      resolve(files)
    })
  })
}

module.exports = generateVideoThumbnails
