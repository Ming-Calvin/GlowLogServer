// 路由
const Router = require('koa-router')
const router = new Router()
// 校验
const {validate} = require("../middlewares/validation");
const {  } = require("../schema/userSchema");
// 数据库
const { User } = require("../models");
// 返回函数
const {successResponse, failureResponse} = require("../until/responseData");
const authMiddleware = require("../middlewares/auth");

router.get('/getUserInfo', authMiddleware, async (ctx) => {
  try {
    const userId = ctx.state.user.userId;

    const usrInfo = await User.findAll({
      where: {
        user_id: userId
      }
    })

    ctx.body = successResponse('success', usrInfo);
  } catch (e) {
    ctx.status = 500;
    ctx.body = failureResponse('An error occurred while fetching the User entries.')
  }
})

module.exports = router;





