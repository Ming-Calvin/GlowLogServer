const Router = require('koa-router');
const router = new Router();
const usersRouter = require('./users');

// example route
router.get('/', async (ctx) => {
  ctx.body = { message: 'Hello koa' }
})

// Use users routes
router.use(usersRouter.routes())

module.exports = router
