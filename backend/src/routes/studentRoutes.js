const { Router } = require("express")
const controller = require("../controllers/studentController")

const router = Router()

// not really applicable to this application, maybe later this should be a protected route that only the professor uses
router.get("/", controller.getStudents)
// create new student in db
router.post("/", controller.addStudent)
// TODO: get attempt data for student
router.get("/:name", controller.getStudentByName)

module.exports = router
