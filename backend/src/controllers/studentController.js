const pool = require("../../db")
const AppError = require("../../utils/AppError")
const queries = require("../queries/studentQueries")

/**
 * Throws generic app error and sends 500 to client when queries fail
 */
const handleQueryError = (error, next) => {
  if (error) {
    res.status(500).send("Internal Server Error")
    return next(new AppError("Error executing query", 500))
  }
}

exports.getStudents = (req, res) => {
  pool.query(queries.getStudents, (error, results) => {
    if (error) {
      console.error("Error executing query: ", error)
      res.status(500).send("Internal Server Error")
    }

    res.status(200).json(results.rows)
  })
}

/**
 * Used to check whether a student exists in the database
 */
exports.getStudentByName = (req, res) => {
  const name = req.params.name.toLocaleLowerCase()

  if (!name) res.status(400).send("Please provide a student name")

  pool.query(queries.getStudentByName, [name], (error, results) => {
    handleQueryError(error, next)

    if (!results.rows.length) {
      res.status(404).send("No student by that name was found in the database")
    }

    // no response data sent - success status is sufficient
    res.status(200).send()
  })
}

exports.addStudent = (req, res, next) => {
  const name = req.body.name.toLocaleLowerCase()

  // did user provide name
  if (!name) {
    res.status(400).json({ message: "Please provide your name" })
    return next(new AppError("Error 💥: no name provided", 400))
  }

  // does name already exist in db
  pool.query(queries.getStudentByName, [name], (error, results) => {
    handleQueryError(error, next)

    if (results.rows.length !== 0) {
      // student exists
      req.body.studentId = results.rows[0].student_id
      next()
    } else {
      // okay to add new student to db
      pool.query(queries.addStudent, [name], (error, results) => {
        handleQueryError(error, next)

        req.body.studentId = results.rows[0].student_id
        next()
      })
    }
  })
}
