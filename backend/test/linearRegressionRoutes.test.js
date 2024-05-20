const request = require("supertest")
const app = require("../app")
const pool = require("../db")

beforeAll(async () => {
  // clear the database
  await pool.query("DELETE FROM attempts")
  await pool.query("DELETE FROM coordinate_sets")
  await pool.query("DELETE FROM students")
})

afterAll(async () => {
  await pool.end() // Ensure the pool is closed
})

describe("Linear Regression Routes", () => {
  describe("POST /api/v1/submit", () => {
    it("should add coordinates and check if they form the line of best fit", async () => {
      const studentRes = await request(app)
        .post("/api/v1/students")
        .send({ name: "Jane Doe" })
      const studentId = studentRes.body.studentId

      const res = await request(app)
        .post("/api/v1/submit")
        .send({
          name: "Jane Doe",
          studentId,
          coordinates: [1, 2, 2, 3, 3, 4, 4, 5, 5, 6],
          slope: 1,
          intercept: 1,
          attemptNum: 1,
        })

      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty("status", "success")
      expect(res.body.data).toHaveProperty("isCorrect")
    })

    it("should return 400 if required fields are missing", async () => {
      const res = await request(app)
        .post("/api/v1/submit")
        .send({
          coordinates: [1, 2, 2, 3, 3, 4, 4, 5, 5, 6],
        })

      expect(res.statusCode).toBe(400)
      expect(res.body).toHaveProperty("message")
    })

    it("should log attempts correctly and reveal answer after 3 incorrect attempts", async () => {
      const studentRes = await request(app)
        .post("/api/v1/students")
        .send({ name: "testStudent2" })
      const studentId = studentRes.body.studentId

      for (let i = 1; i <= 3; i++) {
        const res = await request(app)
          .post("/api/v1/submit")
          .send({
            name: "testStudent2",
            studentId,
            coordinates: [1.0, 1.0, 2.0, 2.0, 3.0, 3.0, 4.0, 4.0, 5.0, 5.0],
            slope: 2.0,
            intercept: 1.0,
            attemptNum: i,
          })
        if (i < 3) {
          expect(res.statusCode).toBe(200)
          expect(res.body.data).toHaveProperty("isCorrect", false)
          expect(res.body.data).toHaveProperty("attemptNum", i + 1)
        } else {
          expect(res.statusCode).toBe(200)
          expect(res.body.message).toBe("reveal answer")
          expect(res.body.data).toHaveProperty("slope")
          expect(res.body.data).toHaveProperty("intercept")
        }
      }
    })
  })
})
