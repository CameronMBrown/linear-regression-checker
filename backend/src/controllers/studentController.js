const pool = require("../../db")
const queries = require("../queries/studentQueries")
const AppError = require("../../utils/AppError")
const { handleQueryError } = require("../../utils/queryError")

const sanitizeName = (name, res, next) => {
  // did user provide name
  if (!name) {
    res.status(400).json({ message: "Please provide your name" })
  }

  return name.toLocaleLowerCase()
}

exports.confirmResponse = (req, res) => {
  const statusCode = req.body.message === "Student record created" ? 201 : 409
  res.status(statusCode).json({
    status: "success",
    message: req.body.message,
    studentId: req.body.studentId,
  })
}

exports.getStudents = (req, res) => {
  pool.query(queries.getStudents, (error, results) => {
    handleQueryError(res, error, next)

    res.status(200).json(results.rows)
  })
}

exports.getStudentIdByName = (req, res, next) => {
  const name = sanitizeName(req.params.name, res, next)

  pool.query(queries.getStudentIdByName, [name], (error, results) => {
    if (error) {
      return handleQueryError(res, error, next)
    }

    if (!results.rows.length) {
      res.status(404).send("No student by that name was found in the database")
      return next(new AppError("student lookup failed"))
    } else {
      req.body.studentId = results.rows[0].student_id
      next()
    }
  })
}

exports.addStudent = (req, res, next) => {
  const name = sanitizeName(req.body.name, res, next)

  // does name already exist in db
  pool.query(queries.getStudentIdByName, [name], (error, results) => {
    if (error) {
      return handleQueryError(res, error, next)
    }

    if (results.rows.length !== 0) {
      // student exists
      req.body.studentId = results.rows[0].student_id
      req.body.message = "Student already exists"
      next()
    } else {
      // okay to add new student to db
      pool.query(queries.addStudent, [name], (error, results) => {
        if (error) {
          return handleQueryError(res, error, next)
        }

        req.body.studentId = results.rows[0].student_id
        req.body.message = "Student record created"
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
