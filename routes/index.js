const Router = require('koa-router');
const router = new Router()
const usersRouter = require('./users');
const whiteNoise = require('./whitenoise')

// example route
router.get('/', async (ctx) => {
  ctx.body = { message: 'Hello koa' }
})

// Use users routes
router.use(usersRouter.routes())

// Use whiteNoise routes
router.use(whiteNoise.routes())

module.exports = router
