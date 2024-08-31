// 路由
const Router = require('koa-router')
const router = new Router()
// 校验
const {validate} = require("../middlewares/validation");
const {addDiarySchema} = require("../schema/diarySchema");
// token校验
const authMiddleware = require("../middlewares/auth");
// 数据库
const {User, Diary, Attachment, sequelize} = require("../models");
// 返回数据
const {successResponse, failureResponse} = require("../until/responseData");
// 上传中间件
const upload  = require('../middlewares/upload')
const path = require('path')

// 新增日志信息接口
router.post('/addDiaryEntry',
  authMiddleware,
  upload.single('file'),
  async (ctx, next) => {
    // 将 multer 解析的数据复制到 ctx.request.body 以便 Joi 可以验证
    ctx.request.body = ctx.req.body;
    await next();
  },
  validate(addDiarySchema),
  async (ctx) => {
  const { title, mood, content } = ctx.request.validatedBody;
  const { file } = ctx.req

  // 从token中找到用户信息
  const userId = ctx.state.user.userId

  // 开始事务
  const transaction = await sequelize.transaction()

  try {
    // 获取user信息
    const user = await User.findOne({
      where: {
        user_id: userId
      }
    }, transaction)

    if (!user) {
      ctx.status = 404;
      ctx.body = failureResponse('User not found.');
      await transaction.rollback(); // 回滚事务
      return;
    }

    // 检查文件是否已上传
    if (!file) {
      ctx.status = 400;
      ctx.body = failureResponse('No file uploaded or invalid file type.');
      await transaction.rollback(); // 回滚事务
      return;
    }

    // 创建新的日志条目
    const diary = await Diary.create({
      user_id: userId,
      author_name: user.username,
      title,
      content,
      mood,
    }, { transaction });

    const fileName = path.basename(file.path)
    const fileUrl = `${ ctx.origin }/files/${ fileName }`

    // 创建新的附件记录
    await Attachment.create({
      business_id: diary.diary_id, // 这里使用 diary_id 作为 business_id
      business_type: 'diary', // 设置业务类型为 'diary'
      file_url: fileUrl, // 文件的存储路径
    }, { transaction });

    // 提交事务
    await transaction.commit();

    ctx.body = successResponse('add diary entry successfully.')
  } catch (e) {
    await transaction.rollback(); // 回滚事务

    ctx.status = 500;

    ctx.body = failureResponse('An error occurred while creating the journal entry.')
  }

})

module.exports = router;