const pool = require("../../db")
const AppError = require("../../utils/AppError")
const queries = require("../queries/linearRegressionQueries")

const verifyStudentId = (studentId, res, next) => {
  if (!studentId) {
    res
      .status(500)
      .json({ message: "Student lookup failed, please try again later." })
    console.log("Student ID: ", studentId)
    return next(new AppError("Unable to fetch student id", 500))
  }

  return studentId
}

const leastSquares = (coordinates) => {
  const numCoordinates = coordinates.length / 2 // always 5 in this version of this app
  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumXSquared = 0
  for (let i = 0; i < coordinates.length; i += 2) {
    sumX += parseFloat(coordinates[i])
    sumY += parseFloat(coordinates[i + 1])
    sumXY += parseFloat(coordinates[i]) * parseFloat(coordinates[i + 1])
    sumXSquared += parseFloat(coordinates[i]) * parseFloat(coordinates[i])
  }

  const computedSlope =
    (numCoordinates * sumXY - sumX * sumY) /
    (numCoordinates * sumXSquared - sumX * sumX)

  const computedIntercept = (sumY - computedSlope * sumX) / numCoordinates

  return { computedSlope, computedIntercept }
}

/**
 * If the current coordinates do not exist in the db, add them.
 * Expects a student id from previous middleware.
 */
exports.addCoordinates = (req, res, next) => {
  const studentId = verifyStudentId(req.body.studentId, res, next)
  const { coordinates, setId } = req.body

  // this is this first attempt with a new set of coordinates
  if (!setId) {
    pool.query(
      queries.addCoordinates,
      [studentId, ...coordinates],
      (error, results) => {
        if (error) {
          console.error("Error executing query: ", error)
          res.status(500).send("Internal Server Error")
        }

        res.locals.set_id = results.rows[0].set_id
        next()
      }
    )
  } else {
    // do not create duplicates in db
    res.locals.setId = setId
    next()
  }
}

exports.isLineOfBestFit = (req, res, next) => {
  const studentId = verifyStudentId(req.body.studentId, res, next)
  const { coordinates, slope, intercept, attemptNum } = req.body

  if (!coordinates || !slope || !intercept || !attemptNum) {
    res.status(400).json({
      message: `VALUES [${coordinates ? "" : "coordinates, "}${
        slope ? "" : "slope, "
      }${intercept ? "" : "intercept, "}${
        attemptNum ? "" : "attempt"
      }] were not recieved. Please try again`,
    })
    return next(new AppError("Missing submission data", 400))
  }

  // do least squares function
  const { computedSlope, computedIntercept } = leastSquares(coordinates)

  // round to 2 significant figures and check for a match between calculated and posted values
  let isCorrect = false
  if (
    parseFloat(slope).toFixed(1) === computedSlope.toFixed(1) &&
    parseFloat(intercept).toFixed(1) === computedIntercept.toFixed(1)
  ) {
    isCorrect = true
  }

  // log attempt to db
  console.log(req.body)
  pool.query(
    queries.newAttempt,
    [studentId, slope, intercept, isCorrect, attemptNum],
    (error, results) => {
      if (error) {
        console.error("Error executing query: ", error)
        res.status(500).send("Internal Server Error")
      }

      const attemptId = results.rows[0].attempt_id

      if (!isCorrect && attemptNum > 3) {
        res.status(200).json({
          message: "reveal answer",
          status: "success",
          data: {
            isCorrect,
            attemptNum: 1,
            setId: undefined,
            slope: computedSlope,
            intercept: computedIntercept,
          },
        })
      } else {
        res.status(200).json({
          status: "success",
          data: {
            attemptNum: attemptNum + 1,
            setId: res.locals.set_id,
            isCorrect,
          },
        })
      }
    }
  )
}
