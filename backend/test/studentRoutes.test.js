const request = require("supertest")
const app = require("../app")
const pool = require("../db") // Assuming you have a db.js file that exports the pool

beforeAll(async () => {
  // clear the database
  await pool.query("DELETE FROM attempts")
  await pool.query("DELETE FROM coordinate_sets")
  await pool.query("DELETE FROM students")
})

afterAll(async () => {
  await pool.end() // Ensure the pool is closed
})

describe("Student Routes", () => {
  describe("POST /api/v1/students", () => {
    it("should create a new student", async () => {
      const res = await request(app)
        .post("/api/v1/students")
        .send({ name: "John Doe" })
      expect(res.statusCode).toBe(201)
      expect(res.body).toHaveProperty("studentId")
    })

    it("should return 400 if no name is provided", async () => {
      const res = await request(app).post("/api/v1/students").send({})
      expect(res.statusCode).toBe(400)
      expect(res.body).toHaveProperty("message", "Please provide your name")
    })

    it("should return 409 if student already exists", async () => {
      await request(app)
        .post("/api/v1/students")
        .send({ name: "existingStudent" })
      const res = await request(app)
        .post("/api/v1/students")
        .send({ name: "existingStudent" })
      expect(res.statusCode).toBe(409)
      expect(res.body).toHaveProperty("message", "Student already exists")
    })
  })
})
