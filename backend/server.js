const express = require("express")
const dotenv = require("dotenv")
const studentRoutes = require("./src/routes/studentRoutes")

process.on("uncaughtException", (err) => {
  console.log("uncaught exception! 💥 Shutting down...")
  console.log(err.name, err.message)
  process.exit(1)
})

dotenv.config({ path: "./config.env" })

const app = require("./app")
const PORT = process.env.PORT || 3000

app.get("/", (req, res) => {
  res.send("hello from the server")
})

app.use("/api/v1/students", studentRoutes)

const server = app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`)
})

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message)
  console.log("unhandled rejection! 💥 Shutting down...")
  server.close(() => {
    process.exit(1)
  })
})
