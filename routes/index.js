const Router = require('koa-router');
const {successResponse} = require("../until/responseData");
const router = new Router()
const loginRouter = require("./Login");
const diaryRouter = require("./Diary");
const whitenoiseRouter = require("./Whitenoise");
const userRouter = require("./User");

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
// 用户路由
router.use(userRouter.routes())


module.exports = router
