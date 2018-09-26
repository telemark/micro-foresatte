const Router = require('router')
const finalhandler = require('finalhandler')
const jwt = require('express-jwt')
const handleUnauthorized = require('./lib/handle-unauthorized')
const { JWT_SECRET } = require('./config')
const handler = require('./lib/handler')

const router = Router()

// JWT
router.use(jwt({ secret: JWT_SECRET }).unless({ path: ['/'] }))
router.use(handleUnauthorized)

// ROUTES
router.get('/', handler.getFrontpage)
router.get('/foresatte/:fnr', handler.getForesatte)
router.post('/foresatte', handler.getForesatte)

module.exports = (request, response) => {
  router(request, response, finalhandler(request, response))
}
