exports.getStudents = "SELECT * FROM students"
exports.getStudentByName = "SELECT * FROM students WHERE name = $1"
exports.addStudent = "INSERT INTO students (name) VALUES ($1) RETURNING *"
