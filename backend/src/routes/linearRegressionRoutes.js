const { Router } = require("express")
const controller = require("../controllers/linearRegressionController")
const studentController = require("../controllers/studentController")

const router = Router()

router.post(
  "/",
  studentController.addStudent,
  controller.addCoordinates,
  controller.isLineOfBestFit
)

module.exports = router
