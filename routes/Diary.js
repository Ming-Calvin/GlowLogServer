// 路由
const Router = require('koa-router')
const router = new Router()
// 校验
const {validate} = require("../middlewares/validation");
const {addDiarySchema, getDiaryDatesByMonthSchema} = require("../schema/diarySchema");
// token校验
const authMiddleware = require("../middlewares/auth");
// 数据库
const {User, Diary, Attachment, sequelize, Journal} = require("../models");
// 返回数据
const {successResponse, failureResponse} = require("../until/responseData");
// 上传中间件
const upload  = require('../middlewares/upload')
const path = require('path')
const {Op} = require("sequelize");

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

// 根据月份查询当月有日记的日期接口
router.get('/getDiaryDatesByMonth', authMiddleware, validate(getDiaryDatesByMonthSchema), async (ctx) => {
  try {
    const userId = ctx.state.user.userId;
    const { date } = ctx.request.validatedBody;

    const year = new Date(date).getFullYear()
    const month = new Date(date).getMonth() + 1

    // 第一天
    const startDate = new Date(year, month - 1, 1)
    // 最后一天
    const endDate = new Date(year, month, 0, 23, 59, 59, 999)

    const diaryDates = await Diary.findAll({
      where: {
        user_id: userId,
        created_at: {
          [Op.gte]: startDate,
          [Op.lt]: endDate
        }
      },
      // 只提取created_at
      attributes: ['created_at'],
    })

    const dates =  Array.from(new Set(diaryDates.map(diary => diary.created_at.toISOString().split('T')[0])))

    ctx.body = successResponse('success', dates);
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: 'An error occurred while fetching the journal entries.', error };
  }
});

// 根据月份查询当月有日记的日期接口
router.get('/getDiaryEntriesByDate', authMiddleware, validate(getDiaryDatesByMonthSchema), async (ctx) => {
  try {
    const userId = ctx.state.user.userId;
    const { startDate, endDate } = ctx.request.validatedBody;

    let where = { user_id };

    if (startDate && endDate) {
      where.createdAt = {
        [Op.gte]: new Date(startDate),
        [Op.lt]: new Date(endDate)
      };
    }

    const journals = await Journal.findAll({ where });

    ctx.body = { code: 200, data: journals};
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: 'An error occurred while fetching the journal entries.', error };
  }
});


module.exports = router;