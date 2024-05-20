const AppError = require("./AppError")

/**
 * Throws generic app error and sends 500 to client when queries fail
 */
exports.handleQueryError = (res, error, next) => {
  if (error) {
    res.status(500).send("Internal Server Error")
    return next(new AppError(`Error executing query`, 500))
  }
}
