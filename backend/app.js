// packages
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const rateLimit = require("express-rate-limit")
const xss = require("xss-clean")

// custom modules
const studentRoutes = require("./src/routes/studentRoutes")
const linearRegressionRoutes = require("./src/routes/linearRegressionRoutes")

// error handling
const AppError = require("./utils/AppError")

const app = express()

// logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

// prevent CORS policy errors
app.use(cors())

// limit api requests to 100/h for each ip address
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again later.",
})
app.use("/api", limiter)

// body parser
app.use(
  express.json({
    limit: "10kb",
  })
)

// data sanitization against XSS
app.use(xss())

// ------ ROUTES ------ //
app.use("/api/v1/submit", linearRegressionRoutes)
app.use("/api/v1/students", studentRoutes)

// no route found
app.all("*", (req, res, next) => {
  // express will run err handling middleware when any arg is passed to next
  next(new AppError(`Can't find ${req.originalUrl} on this server`))
})

module.exports = app
