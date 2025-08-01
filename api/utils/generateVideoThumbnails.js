const fs = require("fs")
const path = require("path")
const { exec } = require("child_process")

function generateVideoThumbnails(videoPath, outputDir, count = 10) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

    const outputPattern = path.join(outputDir, "thumb-%03d.jpg")
    const cmd = `ffmpeg -i "${videoPath}" -vf "fps=1/${Math.floor(
      3 * count
    )}" -vframes ${count} "${outputPattern}" -hide_banner -loglevel error`

    exec(cmd, (err) => {
      if (err) return reject(err)

      const thumbs = Array.from({ length: count }, (_, i) =>
        path.join(outputDir, `thumb-${String(i + 1).padStart(3, "0")}.jpg`)
      )

      const existingThumbs = thumbs.filter(fs.existsSync)

      if (existingThumbs.length === 0) {
        return reject(new Error("Nenhum thumbnail foi gerado pelo ffmpeg."))
      }

      resolve(existingThumbs)
    })
  })
}

module.exports = generateVideoThumbnails
