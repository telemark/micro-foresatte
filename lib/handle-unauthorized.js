const { send } = require('micro')

module.exports = (error, request, response, next) => {
  if (error.name === 'UnauthorizedError') {
    send(response, 401, { error: 'invalid token' })
  }
  return next()
}
