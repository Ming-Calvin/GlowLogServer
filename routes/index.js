const Router = require('koa-router');
const {successResponse} = require("../until/responseData");
const router = new Router()
const loginRouter = require("./Login");
const diaryRouter = require("./Diary");
const whitenoiseRouter = require("./Whitenoise");


// const usersRouter = require('./user');
// const whiteNoise = require('./whitenoise')
// const journal = require('./journal')
// const dialog = require('./dialog')

// example route
router.get('/', async (ctx) => {
  ctx.body = successResponse('Connect Successfully')
})

// 登录路由
router.use(loginRouter.routes())
// 日志路由
router.use(diaryRouter.routes())
// 白噪音路由
router.use(whitenoiseRouter.routes())

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
