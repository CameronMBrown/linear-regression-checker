const { Router } = require("express")
const controller = require("../controllers/studentController")

const router = Router()

// create new student in db
router.post("/", controller.addStudent, controller.confirmSuccess)

// not critical to this application, but probably useful to the professor
router.get("/", controller.getStudents)

router.get(
  "/statistics/:name",
  controller.getStudentIdByName,
  controller.getAttemptsByStudentId
)

module.exports = router
