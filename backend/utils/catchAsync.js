// refactoring function to avoid repeating try catch blocks in async functions
module.exports = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => next(err))
}
