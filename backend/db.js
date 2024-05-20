require("dotenv").config()
const Pool = require("pg").Pool

const pool = new Pool({
  user: process.env.DB_USERNAME || "postgres",
  host: "localhost",
  database: process.env.DB_NAME || "studentsubmissions",
  password: process.env.DB_PASSWORD || "",
  port: 5432,
})

module.exports = pool
