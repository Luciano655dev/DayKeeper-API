const getTodayDate = require(`./api/utils/getTodayDate`)

describe("POST /users", () => {
  describe("given a username and password", () => {
    test("should respond with the correct date", async () => {
        const today = getTodayDate()

        console.log(today)
    })
  })

})