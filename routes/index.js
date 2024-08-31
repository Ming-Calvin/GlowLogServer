const Router = require('koa-router');
const {successResponse} = require("./responseData");
const router = new Router()
// const usersRouter = require('./user');
// const whiteNoise = require('./whitenoise')
// const journal = require('./journal')
// const dialog = require('./dialog')

// example route
router.get('/', async (ctx) => {
  ctx.body = successResponse({
    message: 'Connect Successfully'
  })
})

// // Use users routes
// router.use(usersRouter.routes())
//
// // Use whiteNoise routes
// router.use(whiteNoise.routes())
//
// // Use journal routes
// router.use(journal.routes())
//
// // Use dialog routes
// router.use(dialog.routes())



module.exports = router
