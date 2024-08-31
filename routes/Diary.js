// 路由
const Router = require('koa-router')
const router = new Router()
// 校验
const {validate} = require("../middlewares/validation");
const {addDiarySchema} = require("../schema/diarySchema");
const authMiddleware = require("../middlewares/auth");
const {User, Diary} = require("../models");
const {successResponse, failureResponse} = require("../until/responseData");

// 新增日志信息接口
router.post('/addDiaryEntry',authMiddleware, validate(addDiarySchema), async (ctx) => {
  const { title, mood, content } = ctx.request.validatedBody;

  // 从token中找到用户信息
  const userId = ctx.state.user.userId

  // 获取user信息
  const user = await User.findOne({
    where: {
      user_id: userId
    }
  })

  try {
    await Diary.create({
      user_id: userId,
      author_name: user.username,
      title,
      content,
      mood
    })

    ctx.body = successResponse('add diary entry successfully.')
  } catch (e) {
    ctx.status = 500;

    ctx.body = failureResponse('An error occurred while creating the journal entry.')
  }

})

module.exports = router;