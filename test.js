const bcrypt = require("bcryptjs")

async function hello() {
  const password = "teste"
  const hash = await bcrypt.hash(password, 12)

  console.log(hash)
}

hello()
