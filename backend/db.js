const Pool = require("pg").Pool

const USER_NAME = "" // your postgres username here
const HOST = "localhost"
const DATABASE_NAME = "studentsubmissions"
const PASSWORD = ""
const PORT = 5432

if (USER_NAME === "") {
  console.error("You are missing the user name configuration in /backend/db.js")
  console.log("shutting down...")

  process.exit(1)
}

const pool = new Pool({
  user: USER_NAME,
  host: HOST,
  database: DATABASE_NAME,
  password: PASSWORD,
  port: PORT,
})

module.exports = pool
