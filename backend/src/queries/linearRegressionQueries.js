exports.addCoordinates =
  "INSERT INTO coordinate_sets (student_id, x1, y1, x2, y2, x3, y3, x4, y4, x5, y5) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING set_id"

exports.newAttempt =
  "INSERT INTO attempts (set_id, slope, intercept, is_correct, attempt_number) VALUES ($1, $2, $3, $4, $5); RETURNING attempt_id"
