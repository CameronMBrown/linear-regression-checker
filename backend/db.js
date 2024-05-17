const Pool = require("pg").Pool

const pool = new Pool({
  user: "cameron",
  host: "localhost",
  database: "studentsubmissions",
  password: "",
  port: 5432,
})

module.exports = pool
