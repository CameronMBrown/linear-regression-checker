exports.getStudents = "SELECT * FROM students"
exports.getStudentIdByName = "SELECT student_id FROM students WHERE name = $1"
exports.addStudent = "INSERT INTO students (name) VALUES ($1) RETURNING *"
exports.getStudentStats =
  "SELECT a.is_correct FROM attempts a JOIN coordinate_sets cs ON a.set_id = cs.set_id WHERE cs.student_id = $1;"
