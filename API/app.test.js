const request = require(`supertest`)
const app = require(`./app`)

const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1Y2JhYWI4NGI5ZDFjY2U0MWU5OGI2MCIsIm5hbWUiOiJMdWNpYW5vIiwiaWF0IjoxNzE4OTQxNzEwfQ.hn-MOhbsvp-d5wVBROKiJfB6F2ioddcimCElJMf1Iv4`

describe("POST /users", () => {
  describe("given a username and password", () => {

    test("should respond with a 200 status code", async () => {
      const response = await request(app).get("/Luciano").set('Authorization', `Bearer ${token}`)

      expect(response.statusCode).toBe(200)
    })

    test("should respond with a 404 status code", async () => {
        const response = await request(app).get("/lelelele").set('Authorization', `Bearer ${token}`)
  
        expect(response.statusCode).toBe(404)
    })

    test("should respond with a 400 status code", async () => {
        const response = await request(app).get("/lelelele")
  
        expect(response.statusCode).toBe(400)
    })

    test("should respond with a 409 status code", async () => {
        const response = await request(app).get("/lelelele").set('Authorization', `Bearer INVALIDONE`)
  
        expect(response.statusCode).toBe(409)
    })
  })

})