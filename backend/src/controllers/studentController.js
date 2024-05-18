const pool = require("../../db")
const AppError = require("../../utils/AppError")
const queries = require("../queries/studentQueries")

/**
 * Throws generic app error and sends 500 to client when queries fail
 */
const handleQueryError = (res, error, next) => {
  if (error) {
    res.status(500).send("Internal Server Error")
    return next(new AppError(`Error executing query`, 500))
  }
}

exports.confirmSuccess = (req, res) => {
  res.status(201).json({ status: "success", message: "student record created" })
}

exports.getStudents = (req, res) => {
  pool.query(queries.getStudents, (error, results) => {
    handleQueryError(res, error, next)

    res.status(200).json(results.rows)
  })
}

exports.getStudentIdByName = (req, res, next) => {
  const name = req.params.name.toLocaleLowerCase()

  if (!name) {
    res.status(400).send("Please provide a student name")
    return next(new AppError("Error 💥: no name provided", 400))
  }

  pool.query(queries.getStudentIdByName, [name], (error, results) => {
    handleQueryError(res, error, next)

    if (!results.rows.length) {
      res.status(404).send("No student by that name was found in the database")
      return new (AppError("student lookup failed"))()
    } else {
      req.body.studentId = results.rows[0].student_id
      next()
    }
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
  pool.query(queries.getStudentIdByName, [name], (error, results) => {
    handleQueryError(res, error, next)

    if (results.rows.length !== 0) {
      // student exists
      req.body.studentId = results.rows[0].student_id
      next()
    } else {
      // okay to add new student to db
      pool.query(queries.addStudent, [name], (error, results) => {
        handleQueryError(res, error, next)

        req.body.studentId = results.rows[0].student_id
        next()
      })
    }
  })
}

exports.getAttemptsByStudentId = (req, res, next) => {
  const studentId = req.body.studentId

  pool.query(queries.getStudentStats, [studentId], (error, results) => {
    handleQueryError(res, error, next)

    const totalAttempts = results.rows.length
    let successes = 0
    results.rows.forEach((result) => {
      if (result.is_correct) successes++
    })
    const successRate = (successes / totalAttempts) * 100

    res.status(200).json({
      status: "success",
      data: {
        totalAttempts,
        successes,
        successRate,
      },
    })
  })
}
